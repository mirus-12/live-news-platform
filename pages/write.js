import { useState } from "react";
import { supabase } from "../lib/supabaseClient";


export default function Write() {
const [title, setTitle] = useState("");
const [content, setContent] = useState("");


async function submitNews() {
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
alert("Please log in first.");
return;
}
const { error } = await supabase.from("news").insert([{ title, content, user_id: user.id }]);
if (!error) {
alert("News submitted! Waiting for approval.");
setTitle("");
setContent("");
} else alert(error.message);
}


return (
<div className="container">
<h1>Write News</h1>
<input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
<textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
<button className="btn btn-primary" onClick={submitNews}>Submit</button>
</div>
);
}
