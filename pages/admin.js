import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getUserRole } from "../lib/getUserRole";


export default function Admin() {
const [role, setRole] = useState("user");
const [users, setUsers] = useState([]);
const [news, setNews] = useState([]);


useEffect(() => {
checkRole();
fetchNews();
fetchUsers();
}, []);


async function checkRole() {
const { data: { user } } = await supabase.auth.getUser();
if (!user) return;
const r = await getUserRole(user.id);
setRole(r);
}


async function fetchUsers() {
let { data, error } = await supabase.from("roles").select("*");
if (!error) setUsers(data || []);
}


async function fetchNews() {
let { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
if (!error) setNews(data || []);
}


async function updateUserRole(userId, newRole) {
await supabase.from("roles").upsert({ user_id: userId, role: newRole });
fetchUsers();
}


async function approveNews(id, approve) {
await supabase.from("news").update({ approved: approve }).eq("id", id);
fetchNews();
}


if (role !== "superadmin") return <div className="container"><p>Access denied. Superadmin only.</p></div>;


return (
<div className="container">
<h1>Superadmin Dashboard</h1>


<section>
<h2>Manage Users</h2>
{users.map((u) => (
<div className="card" key={u.user_id}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<div>{u.user_id}</div>
<div>
<button className="btn" onClick={() => updateUserRole(u.user_id, 'user')}>User</button>
<button className="btn btn-primary" onClick={() => updateUserRole(u.user_id, 'admin')}>Admin</button>
<button className="btn btn-danger" onClick={() => updateUserRole(u.user_id, 'superadmin')}>Superadmin</button>
</div>
</div>
</div>
))}
</section>


<section>
<h2>Manage News</h2>
{news.map((n) => (
<div className="card" key={n.id}>
<h4>{n.title}</h4>
<p>{n.content}</p>
<small>{new Date(n.created_at).toLocaleString()}</small>
<div style={{ marginTop: 8 }}>
<button className="btn btn-primary" onClick={() => approveNews(n.id, true)}>Approve</button>
<button className="btn" onClick={() => approveNews(n.id, false)}>Unapprove</button>
</div>
</div>
))}
</section>
</div>
);
}
