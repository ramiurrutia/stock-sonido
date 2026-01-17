import axios from "axios";

export default async function PageAnvils(){

    const anvilData = await axios.get(`http://localhost:4000/anvils`);

    const anvils = anvilData.data


    return <>
        <p>{anvils}</p>
    </>
}