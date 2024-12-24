import {Scanner} from "@yudiel/react-qr-scanner";

export default function QRscan({method})
{
    return(<Scanner onScan={(result)=>{method(result);}}/>);
}


