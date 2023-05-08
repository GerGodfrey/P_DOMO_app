// TODO : 
    // https://www.freecodecamp.org/news/pass-data-between-components-in-react/ 
    // Agregar en el botón de compra que no puede realizar nada con un "status" problematico
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import { useEffect, useState } from 'react'

import { firebase } from "../../../connection/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const WidgetUpload = ({userData}) => {

    const uploader = Uploader({ apiKey: process.env.NEXT_PUBLIC_UPLOADER_PUBLIC });
    const [data, setData] = useState(null);

    
    const uploaderOptions = {
        multi: true,
        showFinishButton: true,
        styles: {
          colors: {
            primary: "#377dff"
          }
        }
    }

    
    async function sendInfo(data) {
        const ref = collection(firebase, "user_personal_info");
        console.log(data)
        const kyc = {
            "status": false
        }
    
        try {
            const docRef = await setDoc(doc(firebase,"user_personal_info",data.id),{
                data,kyc
            });

            console.log("Document written with ID: ", docRef);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    async function saveData(data){
        await sendInfo(data)
    }

    function getUrls(files) {
        try {
            let cont = 1
            files.map(function(x) {
                let name = "photo"+cont
                userData[name] = x.fileUrl
                cont = cont + 1
            });
            console.log("USERDATA:",userData)
            saveData(userData)

        } catch (error) {
            console.error("Error in getUrls",error)
        }
    }

    return (
        <div>
            <label className='w-full flex  text-white text-2xl p-4'>
                Foto de Identificación Oficial (INE, Pasaporte)
            </label>
            <a className='w-full flex  text-white text-2xl p-4'> El nombre de las imágenes sin espacio</a>
            <UploadDropzone uploader={uploader}
            options={uploaderOptions}
            onComplete={files => getUrls(files)}
            width="600px"
            height="375px" 
            />
        </div>
        
    )

}

export default WidgetUpload;