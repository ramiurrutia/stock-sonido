import axios from "axios";

export default async function ItemPage({ params, }: { params: Promise<{ code: string }>; }) {

    const code = (await params).code;

    const itemData = await axios.post("http://localhost:4000/scan", {
        code: code
    });

    const data = itemData.data;

    interface Item {
        imageUrl: string;
        name: string;
        code: string;
        category: string;
        status: string;
        notes: string;
    }

    const ItemResult = ({ data }: { data: Item }) => (
        <div>
            <h2>Scan Result:</h2>
            <p>Image URL: {data.imageUrl}</p>
            <p>Name: {data.name}</p>
            <p>Code: {data.code}</p>
            <p>Category: {data.category}</p>
            <p>Status: {data.status}</p>
            <p>Notes: {data.notes}</p>
        </div>
    );


    return (
        <main>
            <h1>Item Page</h1>
            {ItemResult({ data })}
        </main>
    );
} 