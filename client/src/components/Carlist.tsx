import React, { useRef, useState, useEffect } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {
   Alert,
   Button,
   Container,
   Grid,
   Typography,
   Paper,
   styled,
   Box,
   Card,
   CardContent,
   CardMedia,
   Backdrop,
   CircularProgress,
   IconButton,
} from "@mui/material";
import AddCar from "./AddCar";

interface Auto {
   id?: number;
   malli: string;
   rekisteritunnus: string;
   vuosi: string;
   moottorinKoko: string;
   mittarilukema: string;
   hinta: number;
   verot: number;
   myyntipaikka: string;
   huomioita: string;
   kuvanUrl: string;
}

interface ApiData {
   autot: Auto[];
   virhe: string;
   haettu: boolean;
}

interface fetchAsetukset {
   method: string;
   headers?: any;
   body?: string;
}

interface Props {
   token: string;
}
const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
   ...theme.typography.body2,
   padding: theme.spacing(2),
   textAlign: "center",
   color: theme.palette.text.secondary,
}));

const Carlist: React.FC<Props> = (props: Props): React.ReactElement => {
   const navigate: NavigateFunction = useNavigate();
   const [dialogiAuki, setDialogiAuki] = useState<boolean>(false);

   const poistaAuto = (auto: Auto) => {
      apiKutsu("DELETE", undefined, auto.id);
   };

   const [apiData, setApiData] = useState<ApiData>({
      autot: [],
      virhe: "",
      haettu: false,
   });

   const apiKutsu = async (
      metodi?: string,
      auto?: Auto,
      id?: number
   ): Promise<void> => {
      setApiData({
         ...apiData,
         haettu: false,
      });

      let url = id ? `/api/cars/${id}` : `/api/cars`;

      let asetukset: fetchAsetukset = {
         method: metodi || "GET",
         headers: {
            Authorization: `Bearer ${props.token}`,
         },
      };

      if (metodi === "POST") {
         asetukset = {
            ...asetukset,
            headers: {
               ...asetukset.headers,
               "Content-Type": "application/json",
            },
            body: JSON.stringify(auto),
         };
      }

      try {
         const yhteys = await fetch(url, asetukset);

         if (yhteys.status === 200) {
            setApiData({
               ...apiData,
               autot: await yhteys.json(),
               haettu: true,
            });
         } else {
            let virheteksti: string = "";

            switch (yhteys.status) {
               case 400:
                  virheteksti = "Virhe pyynnön tiedoissa";
                  break;
               case 401:
                  navigate("/login");
                  break;
               default:
                  virheteksti = "Palvelimella tapahtui odottamaton virhe";
                  break;
            }

            setApiData({
               ...apiData,
               virhe: virheteksti,
               haettu: true,
            });
         }
      } catch (e: any) {
         setApiData({
            ...apiData,
            virhe: "Palvelimeen ei saada yhteyttä",
            haettu: true,
         });
      }
   };

   useEffect(() => {
      apiKutsu();
   }, []);

   return (
      <Container>
         <Button
            variant="outlined"
            onClick={() => {
               setDialogiAuki(true);
            }}
            sx={{ marginBottom: 2 }}
         >
            Lisää uusi kiinnostava auto
         </Button>

         <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Kiinnostavat kesäautot
         </Typography>

         {Boolean(apiData.virhe) ? (
            <Alert severity="error">{apiData.virhe}</Alert>
         ) : apiData.haettu ? (
            <Box sx={{ flexGrow: 1 }}>
               <Grid container spacing={{ xs: 2, md: 1 }}>
                  {apiData.autot
                     .sort((a, b) => a.hinta - b.hinta)
                     .map((auto: Auto, idx: number) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                           <Item>
                              {" "}
                              <Card>
                                 <CardMedia
                                    component="img"
                                    height="194"
                                    image={auto.kuvanUrl}
                                    alt="kuva"
                                 />

                                 <CardContent>
                                    {" "}
                                    <Typography>{`Malli: ${auto.malli} Rekisteritunnus: ${auto.rekisteritunnus}`}</Typography>
                                    <Typography>{`Hinta: ${auto.hinta} €`}</Typography>
                                    <Typography>{`Verot: ${auto.verot} €`}</Typography>
                                    <Typography>{`Mittarilukema: ${auto.mittarilukema}km`}</Typography>
                                    <Typography>{`Moottori: ${auto.moottorinKoko} `}</Typography>
                                    <Typography>{`Huomioita: ${auto.huomioita} `}</Typography>
                                    <Typography>{`Myyntipaikka: ${auto.myyntipaikka} `}</Typography>
                                    <IconButton
                                       edge="end"
                                       onClick={() => {
                                          poistaAuto(auto);
                                       }}
                                    >
                                       <DeleteIcon />
                                    </IconButton>
                                 </CardContent>
                              </Card>
                           </Item>
                        </Grid>
                     ))}
               </Grid>
               <Button
                  color="secondary"
                  size="large"
                  variant="contained"
                  sx={{ marginTop: 2 }}
                  onClick={() => {
                     navigate("/login");
                     localStorage.setItem("token", "");
                  }}
               >
                  Kirjaudu ulos
               </Button>
            </Box>
         ) : (
            <Backdrop open={true}>
               <CircularProgress color="inherit" />
            </Backdrop>
         )}

         <AddCar
            dialogiAuki={dialogiAuki}
            setDialogiAuki={setDialogiAuki}
            apiKutsu={apiKutsu}
         />
      </Container>
   );
};

export default Carlist;
