import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import LiveAudio from "../components/LiveAudio";


export default function Home() {
const [news, setNews] = useState([]);


useEffect(() => {
fetchNews();
}, []);


async function fetchNews() {
let { data, error } = await supabase.from("news").select("*").eq("approved", true).order("created_at", { ascending: false });
if (!error) setNews(data || []);
}


return (
<div className="container">
<h1>Live News Platform</h1>
<LiveAudio />


<section>
<h2>Latest News</h2>
{news.length === 0 && <p>No news yet.</p>}
{news.map((item) => (
<div key={item.id} className="card">
<h4>{item.title}</h4>
<p>{item.content}</p>
<small>{new Date(item.created_at).toLocaleString()}</small>
</div>
))}
</section>
</div>
);
}
