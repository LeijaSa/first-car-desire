import React, { Dispatch, SetStateAction, useRef } from "react";
import {
   Button,
   Dialog,
   DialogContent,
   DialogTitle,
   Stack,
   TextField,
} from "@mui/material";

interface Props {
   dialogiAuki: boolean;
   setDialogiAuki: Dispatch<SetStateAction<boolean>>;
   apiKutsu: (arg0: string, arg1?: any) => void;
}

const AddCar: React.FC<Props> = (props: Props): React.ReactElement => {
   const lomakeRef: any = useRef<HTMLFormElement>();

   const tallenna = (e: React.FormEvent): void => {
      e.preventDefault();

      props.apiKutsu("POST", {
         id: 0,
         malli: String(lomakeRef.current?.malli.value),
         rekisteritunnus: String(lomakeRef.current?.rekisteritunnus.value),
         vuosi: String(lomakeRef.current?.vuosi.value),
         moottorinKoko: String(lomakeRef.current?.moottorinKoko.value),
         mittarilukema: String(lomakeRef.current?.mittarilukema.value),
         hinta: Number(lomakeRef.current?.hinta.value),
         verot: Number(lomakeRef.current?.verot.value),
         myyntipaikka: String(lomakeRef.current?.myyntipaikka.value),
         huomioita: String(lomakeRef.current?.huomioita.value),
         kuvanUrl: String(lomakeRef.current?.kuvanUrl.value),
      });

      props.setDialogiAuki(false);
   };

   const peruuta = (): void => {
      props.setDialogiAuki(false);
   };

   return (
      <Dialog
         maxWidth="lg"
         fullWidth={true}
         open={props.dialogiAuki}
         onClose={peruuta}
      >
         <DialogTitle>Lisää uusi auto</DialogTitle>
         <DialogContent style={{ paddingTop: 10 }}>
            <Stack
               spacing={1}
               component="form"
               onSubmit={tallenna}
               ref={lomakeRef}
            >
               <TextField
                  name="malli"
                  label="Auton malli"
                  fullWidth
                  variant="outlined"
               />
               <TextField
                  name="rekisteritunnus"
                  label="Auton rekisteritunnus"
                  fullWidth
                  variant="outlined"
               />
               <TextField
                  name="vuosi"
                  label="Auton käyttöönotto"
                  fullWidth
                  variant="outlined"
               />
               <TextField
                  name="moottorinKoko"
                  label="Moottorin koko"
                  fullWidth
                  variant="outlined"
               />
               <TextField
                  name="mittarilukema"
                  label="Kilometrit"
                  fullWidth
                  variant="outlined"
               />
               <TextField
                  name="hinta"
                  label="Auton hinta"
                  fullWidth
                  variant="outlined"
               />
               <TextField
                  name="verot"
                  label="Auton verot"
                  fullWidth
                  variant="outlined"
               />
               <TextField
                  name="myyntipaikka"
                  label="Auton myyntipaikka"
                  fullWidth
                  variant="outlined"
               />
               <TextField
                  name="huomioita"
                  label="Muita huomioita"
                  fullWidth
                  variant="outlined"
               />
               <TextField
                  name="kuvanUrl"
                  label="Kuvan url"
                  fullWidth
                  variant="outlined"
               />

               <Button variant="contained" type="submit">
                  Tallenna
               </Button>

               <Button variant="outlined" onClick={peruuta}>
                  Peruuta
               </Button>
            </Stack>
         </DialogContent>
      </Dialog>
   );
};

export default AddCar;
