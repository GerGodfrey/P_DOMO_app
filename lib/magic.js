
import { Magic } from "magic-sdk"

const createMagic = (key) => {
    return (
      typeof window !== "undefined" &&
      new Magic(key,{
        network: {
          rpcUrl: 'https://matic-mumbai.chainstacklabs.com', // or https://polygon-rpc.com/ for testnet
          chainId: 80001 // or 137 for polygon testnet
        }
      })
    );
  };

  export const magic = createMagic(process.env.NEXT_PUBLIC_PUBLISH_API_KEY);



   