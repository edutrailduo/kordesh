import { createClient } from "https://esm.sh/@supabase/supabase-js@2.102.0";
const SUPABASE_URL="https://bibithkwfrwahttdkcfi.supabase.co";
const SUPABASE_KEY="sb_publishable_S5_tTYQbL6kUkNFp22YhaA_W9SJ-USF";
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);
const $=id=>document.getElementById(id);
const labels={pending:"Pending",confirmed:"Confirmed",processing:"Processing",shipped:"Shipped",delivered:"Delivered",cancelled:"Cancelled"};
function msg(id,text){$(id).textContent=text}
async function showSession(){
 const {data:{session}}=await supabase.auth.getSession();
 if(!session){$("authPanel").hidden=false;$("dashboard").hidden=true;return}
 $("authPanel").hidden=true;
 const {data:admin,error}=await supabase.from("kordesh_admins").select("user_id").eq("user_id",session.user.id).maybeSingle();
 if(error||!admin){$("authPanel").hidden=false;$("dashboard").hidden=true;$("identityHelp").hidden=false;$("userId").textContent=session.user.id;msg("authMessage","আপনার account তৈরি হয়েছে, কিন্তু Admin অনুমোদন এখনো দেওয়া হয়নি।");return}
 $("dashboard").hidden=false;$("signedInAs").textContent=session.user.email||session.user.id;
 await loadOrders();
}
$("authForm").addEventListener("submit",async e=>{e.preventDefault();const email=$("email").value.trim(),password=$("password").value;const {error}=await supabase.auth.signInWithPassword({email,password});if(error){msg("authMessage",error.message);return}msg("authMessage","লগইন হয়েছে।");await showSession()});
$("signupBtn").addEventListener("click",async()=>{const email=$("email").value.trim(),password=$("password").value;if(!email||password.length<8){msg("authMessage","ইমেইল দিন এবং অন্তত ৮ অক্ষরের পাসওয়ার্ড লিখুন।");return}const {data,error}=await supabase.auth.signUp({email,password});if(error){msg("authMessage",error.message);return}if(data.session){msg("authMessage","Account তৈরি হয়েছে। নিচের User ID আমাকে পাঠান।");await showSession()}else{msg("authMessage","Account তৈরি হয়েছে। ইমেইল confirmation সম্পন্ন করে লগইন করুন।")}});
$("logoutBtn").addEventListener("click",async()=>{await supabase.auth.signOut();await showSession()});
$("refreshBtn").addEventListener("click",loadOrders);$("statusFilter").addEventListener("change",loadOrders);
async function loadOrders(){
 msg("dashMessage","অর্ডার লোড হচ্ছে...");
 const {data,error}=await supabase.from("kordesh_orders").select("*").order("created_at",{ascending:false}).limit(100);
 if(error){msg("dashMessage",error.message);return}
 const list=data||[];$("totalCount").textContent=list.length;$("pendingCount").textContent=list.filter(x=>x.status==="pending").length;
 const filter=$("statusFilter").value,rows=filter==="all"?list:list.filter(x=>x.status===filter);
 $("orders").innerHTML=rows.length?rows.map(o=>`<article class="order"><div class="order-head"><div><h3>${o.order_number}</h3><span class="order-meta">${new Date(o.created_at).toLocaleString("en-BD")}</span></div><span class="order-meta">${o.delivery_zone}</span></div><div class="order-grid"><p><b>নাম:</b> ${esc(o.customer_name)}</p><p><b>ফোন:</b> <a href="tel:${esc(o.customer_phone)}">${esc(o.customer_phone)}</a></p><p><b>জেলা:</b> ${esc(o.customer_district)}</p><p><b>এলাকা:</b> ${esc(o.customer_area)}</p><p><b>ঠিকানা:</b> ${esc(o.customer_address)}</p><p><b>নোট:</b> ${esc(o.customer_note||"নেই")}</p></div><div class="items"><b>পণ্য:</b><br>${(o.items||[]).map(i=>esc(i.name)+" × "+i.qty+" = ৳"+(Number(i.price)*Number(i.qty)).toLocaleString("en-BD")).join("<br>")}</div><div class="order-bottom"><span class="total">৳${Number(o.total).toLocaleString("en-BD")}</span><select data-status-id="${o.id}">${Object.entries(labels).map(([v,l])=>`<option value="${v}" ${o.status===v?"selected":""}>${l}</option>`).join("")}</select></div></article>`).join(""):'<div class="panel">এখনো কোনো অর্ডার নেই।</div>';
 $("orders").querySelectorAll("[data-status-id]").forEach(el=>el.addEventListener("change",async()=>{const {error}=await supabase.from("kordesh_orders").update({status:el.value}).eq("id",el.dataset.statusId);if(error){msg("dashMessage",error.message);return}msg("dashMessage","অর্ডারের স্ট্যাটাস আপডেট হয়েছে।");await loadOrders()}));
 msg("dashMessage",rows.length+"টি অর্ডার দেখানো হচ্ছে।");
}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
supabase.auth.onAuthStateChange(()=>{setTimeout(showSession,0)});showSession();