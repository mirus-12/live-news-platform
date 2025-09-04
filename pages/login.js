import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";


export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const router = useRouter();


async function handleLogin() {
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (!error) router.push("/");
else alert(error.message);
}


async function handleSignup() {
const { error } = await supabase.auth.signUp({ email, password });
if (!error) alert("Check your email for confirmation.");
else alert(error.message);
}


return (
<div className="container">
<h1>Login / Register</h1>
<input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
<div style={{ display: "flex", gap: 8 }}>
<button className="btn btn-primary" onClick={handleLogin}>Login</button>
<button className="btn" onClick={handleSignup}>Register</button>
</div>
</div>
);
}
