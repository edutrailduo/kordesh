import { createClient } from "https://esm.sh/@supabase/supabase-js@2.102.0";
const SUPABASE_URL="https://bibithkwfrwahttdkcfi.supabase.co";
const SUPABASE_KEY="sb_publishable_S5_tTYQbL6kUkNFp22YhaA_W9SJ-USF";
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);
const $=id=>document.getElementById(id);
const labels={pending:"Pending",confirmed:"Confirmed",processing:"Processing",shipped:"Shipped",delivered:"Delivered",cancelled:"Cancelled"};
let cachedOrders=[];
let selectedChatId=null;let chatLastId=0;let chatPollTimer=null;let cachedChats=[];
function msg(id,text){$(id).textContent=text}
async function showSession(){
 const {data:{session}}=await supabase.auth.getSession();
 if(!session){$("authPanel").hidden=false;$("dashboard").hidden=true;return}
 $("authPanel").hidden=true;
 const {data:admin,error}=await supabase.from("kordesh_admins").select("user_id").eq("user_id",session.user.id).maybeSingle();
 if(error||!admin){$("dashboard").hidden=true;await supabase.auth.signOut();$("authPanel").hidden=false;msg("authMessage","এই অ্যাকাউন্টটি KORDESH Admin হিসেবে অনুমোদিত নয়। প্রবেশাধিকার দেওয়া হয়নি।");return}
 $("dashboard").hidden=false;$("signedInAs").textContent=session.user.email||session.user.id;
 await loadOrders();
 await loadChatSessions();
 renderSalesReport();
 showAdminView("home");
 if(chatPollTimer)clearInterval(chatPollTimer);chatPollTimer=setInterval(()=>{loadChatSessions();if(selectedChatId)loadAdminChatMessages()},5000);
}
$("recoveryForm").addEventListener("submit",async e=>{e.preventDefault();const password=$("newPassword").value;if(password.length<8){msg("recoveryMessage","অন্তত ৮ অক্ষরের পাসওয়ার্ড দিন।");return}const {error}=await supabase.auth.updateUser({password});if(error){msg("recoveryMessage",error.message);return}msg("recoveryMessage","পাসওয়ার্ড আপডেট হয়েছে। Admin Dashboard খুলছে...");$("recoveryPanel").hidden=true;await showSession()});
$("authForm").addEventListener("submit",async e=>{e.preventDefault();const email=$("email").value.trim(),password=$("password").value;const {error}=await supabase.auth.signInWithPassword({email,password});if(error){msg("authMessage",error.message);return}msg("authMessage","লগইন হয়েছে।");await showSession()});
$("resetBtn").addEventListener("click",async()=>{const email=$("email").value.trim();if(!email){msg("authMessage","আগে আপনার account-এর ইমেইল লিখুন।");return}const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});if(error){msg("authMessage",error.message);return}msg("authMessage","পাসওয়ার্ড reset link পাঠানো হয়েছে। Inbox ও Spam folder দেখুন।")});
$("logoutBtn").addEventListener("click",async()=>{await supabase.auth.signOut();await showSession()});
$("refreshBtn").addEventListener("click",loadOrders);$("statusFilter").addEventListener("change",renderOrders);$("orderSearch").addEventListener("input",renderOrders);$("orderDateFrom").addEventListener("change",loadOrders);$("orderDateTo").addEventListener("change",loadOrders);$("clearDateFilter").addEventListener("click",()=>{$("orderDateFrom").value="";$("orderDateTo").value="";loadOrders()});$("exportBtn").addEventListener("click",exportOrders);
async function loadOrders(){
 msg("dashMessage","অর্ডার লোড হচ্ছে...");
 const fromDate=$("orderDateFrom").value,toDate=$("orderDateTo").value;
 if(fromDate&&toDate&&fromDate>toDate){msg("dashMessage","শুরুর তারিখ শেষ তারিখের পরে হতে পারবে না।");$("orders").innerHTML="";return}
 const {data,error}=await supabase.from("kordesh_orders").select("*").order("created_at",{ascending:false}).limit(1000);
 if(error){msg("dashMessage",error.message);return}
 cachedOrders=data||[];
 $("totalCount").textContent=cachedOrders.length;
 $("pendingCount").textContent=cachedOrders.filter(x=>x.status==="pending").length;
 $("deliveredCount").textContent=cachedOrders.filter(x=>x.status==="delivered").length;
 renderOrders();
}
function localDateBoundary(value,dayOffset=0){
 if(!value)return null;
 const [year,month,day]=value.split("-").map(Number);
 return new Date(year,month-1,day+dayOffset).getTime();
}
function getFilteredOrders(){
 const filter=$("statusFilter").value,query=$("orderSearch").value.trim().toLocaleLowerCase();
 const fromDate=$("orderDateFrom").value,toDate=$("orderDateTo").value;
 if(fromDate&&toDate&&fromDate>toDate){msg("dashMessage","শুরুর তারিখ শেষ তারিখের পরে হতে পারবে না।");return []}
 const fromTime=localDateBoundary(fromDate),toTime=localDateBoundary(toDate,1);
 return cachedOrders.filter(o=>{
  const statusMatch=filter==="all"||o.status===filter;
  const hay=[o.order_number,o.customer_name,o.customer_phone,o.customer_district,o.customer_area].join(" ").toLocaleLowerCase();
  const timestamp=new Date(o.created_at).getTime();
  const dateMatch=(!fromDate||timestamp>=fromTime)&&(!toDate||timestamp<toTime);
  return statusMatch&&dateMatch&&(!query||hay.includes(query));
 });
}
function renderOrders(){
 const rows=getFilteredOrders();
 $("orders").innerHTML=rows.length?rows.map(o=>`<article class="order"><div class="order-head"><div><h3>${esc(o.order_number)}</h3><span class="order-meta">${new Date(o.created_at).toLocaleString("en-BD")}</span></div><span class="order-meta">${esc(o.delivery_zone)}</span></div><div class="order-grid"><p><b>নাম:</b> ${esc(o.customer_name)}</p><p><b>ফোন:</b> <a href="tel:${telValue(o.customer_phone)}">${esc(o.customer_phone)}</a></p><p><b>জেলা:</b> ${esc(o.customer_district)}</p><p><b>এলাকা:</b> ${esc(o.customer_area)}</p><p><b>ঠিকানা:</b> ${esc(o.customer_address)}</p><p><b>নোট:</b> ${esc(o.customer_note||"নেই")}</p><p><b>কুপন:</b> ${esc(o.coupon_code||"নেই")} ${Number(o.discount||0)>0?"(−৳"+Number(o.discount).toLocaleString("en-BD")+")":""}</p><p><b>পেমেন্ট পদ্ধতি:</b> ${esc(({cod:"Cash on Delivery",bkash:"bKash",nagad:"Nagad",bank_transfer:"Bank Transfer",bangla_qr:"Bangla QR"})[o.payment_method]||o.payment_method||"Cash on Delivery")}</p><p><b>পেমেন্ট স্ট্যাটাস:</b> <select data-payment-id="${esc(o.id)}"><option value="unpaid" ${o.payment_status==="unpaid"?"selected":""}>Unpaid</option><option value="awaiting_verification" ${o.payment_status==="awaiting_verification"?"selected":""}>Awaiting verification</option><option value="paid" ${o.payment_status==="paid"?"selected":""}>Paid</option></select></p></div><div class="items"><b>পণ্য:</b><br>${(Array.isArray(o.items)?o.items:[]).map(i=>esc(i.name)+" × "+Number(i.qty||0)+" = ৳"+(Number(i.price||0)*Number(i.qty||0)).toLocaleString("en-BD")).join("<br>")}</div><div class="order-bottom"><span class="total">৳${Number(o.total||0).toLocaleString("en-BD")}</span><select data-status-id="${esc(o.id)}">${Object.entries(labels).map(([v,l])=>`<option value="${v}" ${o.status===v?"selected":""}>${l}</option>`).join("")}</select></div></article>`).join(""):'<div class="panel">কোনো অর্ডার পাওয়া যায়নি।</div>';
 $("orders").querySelectorAll("[data-payment-id]").forEach(el=>el.addEventListener("change",async()=>{
  el.disabled=true;
  const {error}=await supabase.from("kordesh_orders").update({payment_status:el.value}).eq("id",el.dataset.paymentId);
  if(error){msg("dashMessage","পেমেন্ট স্ট্যাটাস আপডেট হয়নি: "+error.message);el.disabled=false;return}
  const order=cachedOrders.find(x=>String(x.id)===el.dataset.paymentId);if(order)order.payment_status=el.value;
  msg("dashMessage","পেমেন্ট স্ট্যাটাস আপডেট হয়েছে।");el.disabled=false;
 }));
 $("orders").querySelectorAll("[data-status-id]").forEach(el=>el.addEventListener("change",async()=>{
  el.disabled=true;
  const {error}=await supabase.from("kordesh_orders").update({status:el.value}).eq("id",el.dataset.statusId);
  if(error){msg("dashMessage","স্ট্যাটাস আপডেট হয়নি: "+error.message);el.disabled=false;return}
  const order=cachedOrders.find(x=>String(x.id)===el.dataset.statusId);if(order)order.status=el.value;
  msg("dashMessage","অর্ডারের স্ট্যাটাস আপডেট হয়েছে।");renderOrders();
 }));
 msg("dashMessage",rows.length+"টি অর্ডার দেখানো হচ্ছে।");
}
function telValue(value){return String(value??"").replace(/[^+0-9]/g,"")}
function csvCell(value){return '"'+String(value??"").replace(/"/g,'""')+'"'}
function exportOrders(){
 const exportRows=getFilteredOrders();if(!exportRows.length){msg("dashMessage","ডাউনলোড করার মতো অর্ডার নেই।");return}
 const columns=["order_number","created_at","customer_name","customer_phone","customer_district","customer_area","customer_address","customer_note","coupon_code","discount","payment_method","payment_status","items","subtotal","delivery_fee","total","delivery_zone","status"];
 const rows=[columns.join(","),...exportRows.map(o=>columns.map(k=>csvCell(k==="items"?(Array.isArray(o.items)?o.items.map(i=>i.name+" x "+i.qty).join("; "):""):o[k])).join(","))];
 const blob=new Blob([String.fromCharCode(65279)+rows.join(String.fromCharCode(13,10))],{type:"text/csv;charset=utf-8"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="kordesh-orders-"+new Date().toISOString().slice(0,10)+".csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
 msg("dashMessage","CSV ফাইল ডাউনলোড শুরু হয়েছে।");
}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
supabase.auth.onAuthStateChange((event)=>{if(event==="PASSWORD_RECOVERY"){$("authPanel").hidden=true;$("dashboard").hidden=true;$("recoveryPanel").hidden=false;return}setTimeout(showSession,0)});showSession();
/* Admin live customer care inbox */
$("chatRefreshBtn")?.addEventListener("click",()=>{loadChatSessions();if(selectedChatId)loadAdminChatMessages()});
$("chatReplyForm")?.addEventListener("submit",async e=>{
 e.preventDefault();if(!selectedChatId)return;
 const input=$("chatReplyInput"),body=input.value.trim();if(!body)return;
 input.disabled=true;
 const {error}=await supabase.rpc("kordesh_chat_admin_send",{p_chat_id:selectedChatId,p_body:body});
 if(error){msg("chatAdminMessage","উত্তর পাঠানো যায়নি: "+error.message);input.disabled=false;return}
 input.value="";input.disabled=false;await loadAdminChatMessages();await loadChatSessions();
});
$("chatCloseBtn")?.addEventListener("click",async()=>{
 if(!selectedChatId||!confirm("এই কথোপকথনটি বন্ধ করবেন?"))return;
 const {error}=await supabase.rpc("kordesh_chat_admin_close",{p_chat_id:selectedChatId});
 if(error){msg("chatAdminMessage","চ্যাট বন্ধ হয়নি: "+error.message);return}
 selectedChatId=null;chatLastId=0;$("chatThread").innerHTML="<p class='muted'>চ্যাট বন্ধ করা হয়েছে।</p>";$("chatConversationTitle").textContent="একটি কথোপকথন নির্বাচন করুন";$("chatReplyInput").disabled=true;$("chatReplyForm").querySelector("button").disabled=true;$("chatCloseBtn").disabled=true;await loadChatSessions();
});
async function loadChatSessions(){
 const {data,error}=await supabase.rpc("kordesh_chat_admin_sessions");
 if(error){msg("chatAdminMessage","লাইভ চ্যাট লোড হয়নি: "+error.message);return}
 cachedChats=Array.isArray(data)?data:[];
 if(selectedChatId){
  const current=cachedChats.find(x=>x.id===selectedChatId);
  const isClosed=!current||current.status==="closed";
  $("chatReplyInput").disabled=isClosed;
  $("chatReplyForm").querySelector("button").disabled=isClosed;
  $("chatCloseBtn").disabled=isClosed;
  if(current&&current.rating_stars)$("chatConversationTitle").textContent=current.customer_name+" · Closed · ★"+current.rating_stars+"/5 · "+current.rating_feedback;
 }
 $("chatInbox").innerHTML=cachedChats.length?cachedChats.map(c=>`<button type="button" class="chat-inbox-item ${selectedChatId===c.id?"selected":""}" data-chat-id="${esc(c.id)}"><strong>${esc(c.customer_name||"Guest")}</strong><small>${esc(c.status)}${c.rating_stars?" · ★"+c.rating_stars+"/5 · "+esc(c.rating_feedback||""):""} · ${new Date(c.last_message_at).toLocaleString("en-BD")}</small><span>${esc(c.last_message||"নতুন চ্যাট")}</span></button>`).join(""):"<p class='muted'>এখনো কোনো নতুন কাস্টমার চ্যাট নেই।</p>";
 $("chatInbox").querySelectorAll("[data-chat-id]").forEach(btn=>btn.addEventListener("click",()=>selectAdminChat(btn.dataset.chatId)));
 const selectedChat=cachedChats.find(x=>x.id===selectedChatId);
 const newestActive=cachedChats.find(x=>x.status!=="closed");
 if(cachedChats.length&&(!selectedChatId||(!selectedChat||selectedChat.status==="closed")&&newestActive)){
  const first=newestActive||cachedChats[0];
  if(selectedChatId!==first.id){
   selectedChatId=first.id;chatLastId=0;
   $("chatConversationTitle").textContent=(first.customer_name||"Guest")+" · "+first.status;
   const closed=first.status==="closed";
   $("chatReplyInput").disabled=closed;
   $("chatReplyForm").querySelector("button").disabled=closed;
   $("chatCloseBtn").disabled=closed;
   await loadAdminChatMessages();
  }
 }
}
async function selectAdminChat(id){
 selectedChatId=id;chatLastId=0;
 const chat=cachedChats.find(x=>x.id===id);
 $("chatConversationTitle").textContent=chat?chat.customer_name+" · "+chat.status:"Customer conversation";
 const isClosed=chat?.status==="closed";
 $("chatReplyInput").disabled=isClosed;$("chatReplyForm").querySelector("button").disabled=isClosed;$("chatCloseBtn").disabled=isClosed;
 await loadChatSessions();await loadAdminChatMessages();
}
async function loadAdminChatMessages(){
 if(!selectedChatId)return;
 const {data,error}=await supabase.rpc("kordesh_chat_admin_messages",{p_chat_id:selectedChatId,p_after_id:chatLastId});
 if(error){msg("chatAdminMessage","মেসেজ লোড হয়নি: "+error.message);return}
 const rows=Array.isArray(data)?data:[];
 if(!chatLastId)$("chatThread").innerHTML="";
 rows.forEach(m=>{
  if(Number(m.id)<=chatLastId)return;
  chatLastId=Math.max(chatLastId,Number(m.id));
  const item=document.createElement("div");item.className="admin-chat-message "+(m.sender==="agent"?"agent":m.sender==="system"?"system":"customer");
  const who=document.createElement("small");who.textContent=m.sender==="agent"?"KORDESH Customer Care":m.sender==="system"?"Automatic system":"Customer";
  const body=document.createElement("p");body.textContent=m.body;
  const time=document.createElement("time");time.textContent=new Date(m.created_at).toLocaleString("en-BD");
  item.append(who,body,time);$("chatThread").appendChild(item);
 });
 $("chatThread").scrollTop=$("chatThread").scrollHeight;
}

/* Admin home navigation and sales reporting */
function showAdminView(view){
 $("adminHome").hidden=view!=="home";
 $("ordersView").hidden=view!=="orders";
 $("chatView").hidden=view!=="chat";
 $("salesView").hidden=view!=="sales";
 if(view==="sales")renderSalesReport();
 if(view==="chat"){loadChatSessions();if(selectedChatId)loadAdminChatMessages()}
 window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-open-view]").forEach(button=>button.addEventListener("click",()=>showAdminView(button.dataset.openView)));
document.querySelectorAll("[data-back-home]").forEach(button=>button.addEventListener("click",()=>showAdminView("home")));
$("salesDateFrom").addEventListener("change",renderSalesReport);
$("salesDateTo").addEventListener("change",renderSalesReport);
$("salesClearDates").addEventListener("click",()=>{$("salesDateFrom").value="";$("salesDateTo").value="";renderSalesReport()});
$("salesRefresh").addEventListener("click",async()=>{await loadOrders();renderSalesReport()});
function getSalesOrders(){
 const from=$("salesDateFrom").value,to=$("salesDateTo").value;
 if(from&&to&&from>to){$("salesReportMessage").textContent="শুরুর তারিখ শেষ তারিখের পরে হতে পারবে না।";return null}
 const start=localDateBoundary(from),end=localDateBoundary(to,1);
 return cachedOrders.filter(o=>{const t=new Date(o.created_at).getTime();return (!from||t>=start)&&(!to||t<end)});
}
function moneyBDT(value){return "৳"+Math.round(Number(value)||0).toLocaleString("en-BD")}
function renderSalesReport(){
 const all=getSalesOrders();if(!all)return;
 const valid=all.filter(o=>o.status!=="cancelled");
 const delivered=valid.filter(o=>o.status==="delivered");
 const revenue=valid.reduce((s,o)=>s+(Number(o.total)||0),0);
 const deliveredRevenue=delivered.reduce((s,o)=>s+(Number(o.total)||0),0);
 const avg=valid.length?revenue/valid.length:0;
 const metrics=[["Total Orders",all.length],["Net Order Value",moneyBDT(revenue)],["Delivered Sales",moneyBDT(deliveredRevenue)],["Average Order Value",moneyBDT(avg)]];
 $("salesMetrics").innerHTML=metrics.map(([label,value])=>'<article class="sales-metric"><small>'+label+'</small><strong>'+value+'</strong></article>').join("");
 const byDay={};
 valid.forEach(o=>{const day=new Date(o.created_at).toLocaleDateString("en-CA");byDay[day]=(byDay[day]||0)+(Number(o.total)||0)});
 const days=Object.entries(byDay).sort((a,b)=>a[0].localeCompare(b[0])).slice(-14),max=Math.max(1,...days.map(x=>x[1]));
 $("dailySalesReport").innerHTML=days.length?days.map(([day,value])=>'<div class="sales-bar-row"><span>'+day+'</span><div class="sales-bar-track"><div class="sales-bar" style="width:'+Math.max(1,value/max*100)+'%"></div></div><b>'+moneyBDT(value)+'</b></div>').join(""):'<p class="sales-empty">এই সময়ের মধ্যে কোনো বিক্রির তথ্য নেই।</p>';
 const products={};
 valid.forEach(o=>(Array.isArray(o.items)?o.items:[]).forEach(item=>{const name=String(item.name||"Unnamed product");if(!products[name])products[name]={qty:0,revenue:0};const qty=Number(item.qty)||0;products[name].qty+=qty;products[name].revenue+=(Number(item.price)||0)*qty}));
 const top=Object.entries(products).sort((a,b)=>b[1].qty-a[1].qty).slice(0,10);
 $("topProductsReport").innerHTML=top.length?'<table class="sales-table"><thead><tr><th>Product</th><th>Qty</th><th>Sales</th></tr></thead><tbody>'+top.map(([name,v])=>'<tr><td>'+esc(name)+'</td><td>'+v.qty+'</td><td>'+moneyBDT(v.revenue)+'</td></tr>').join("")+'</tbody></table>':'<p class="sales-empty">পণ্যের বিক্রির তথ্য পাওয়া যায়নি।</p>';
 $("salesReportMessage").textContent="রিপোর্টে "+all.length+"টি অর্ডার অন্তর্ভুক্ত। Cancelled অর্ডার Net Order Value ও পণ্য বিক্রির হিসাব থেকে বাদ।";
}
