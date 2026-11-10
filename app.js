const CONFIG = {
  // Add your deployed Google Apps Script Web App URL here after setup.
  SHEETS_WEB_APP_URL: "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
  // Replace with your Bangladesh WhatsApp number, e.g. 88017XXXXXXXX.
  WHATSAPP_NUMBER: "8801XXXXXXXXX",
  CURRENCY: "৳"
};

const products = [
  {id:"anua-heartleaf-77",brand:"ANUA",name:"Heartleaf 77% Soothing Toner",bn:"হার্টলিফ ৭৭% সুদিং টোনার",category:"skincare",price:1450,tag:"BESTSELLER",pack:"ANUA\nHEARTLEAF 77",packClass:"",desc:"হার্টলিফ এক্সট্র্যাক্টযুক্ত হালকা টোনার। ত্বককে সতেজ ও আরামদায়ক অনুভূতি দিতে দৈনন্দিন রুটিনে ব্যবহার করা যায়।"},
  {id:"boj-relief-sun",brand:"BEAUTY OF JOSEON",name:"Relief Sun: Rice + Probiotics SPF50+",bn:"রিলিফ সান: রাইস + প্রোবায়োটিকস SPF50+",category:"suncare",price:1550,tag:"SUN CARE",pack:"BEAUTY OF JOSEON\nRELIEF SUN",packClass:"sun",desc:"রাইস এক্সট্র্যাক্ট ও প্রোবায়োটিকসযুক্ত SPF50+ PA++++ সানস্ক্রিন। দিনের বেলায় সূর্যের আলো থেকে ত্বক সুরক্ষার রুটিনে ব্যবহার করুন।"},
  {id:"cosrx-snail-96",brand:"COSRX",name:"Advanced Snail 96 Mucin Essence",bn:"অ্যাডভান্সড স্নেইল ৯৬ মিউসিন এসেন্স",category:"skincare",price:1650,tag:"K-BEAUTY PICK",pack:"COSRX\nSNAIL 96",packClass:"",desc:"৯৬% স্নেইল সিক্রিশন ফিলট্রেটযুক্ত এসেন্স। ত্বকে আর্দ্রতা যোগ ও মসৃণ অনুভূতি দিতে স্কিনকেয়ার রুটিনে ব্যবহার করা হয়।"},
  {id:"skin1004-ampoule",brand:"SKIN1004",name:"Madagascar Centella Ampoule",bn:"মাদাগাস্কার সেন্টেলা অ্যাম্পুল",category:"skincare",price:1750,tag:"DAILY CARE",pack:"SKIN1004\nCENTELLA",packClass:"",desc:"মাদাগাস্কার সেন্টেলা এক্সট্র্যাক্টযুক্ত হালকা অ্যাম্পুল। সংবেদনশীল ত্বকের রুটিনে প্রশান্তিদায়ক যত্নের জন্য পরিচিত।"},
  {id:"roundlab-sun",brand:"ROUND LAB",name:"Birch Juice Moisturizing Sun Cream",bn:"বার্চ জুস ময়েশ্চারাইজিং সান ক্রিম",category:"suncare",price:1690,tag:"SUN CARE",pack:"ROUND LAB\nBIRCH JUICE",packClass:"sun",desc:"বার্চ জুসযুক্ত ময়েশ্চারাইজিং সান ক্রিম। SPF50+ PA++++ সূর্যরশ্মি থেকে সুরক্ষার পাশাপাশি ত্বকে আর্দ্রতার অনুভূতি দেয়।"},
  {id:"somebymi-toner",brand:"SOME BY MI",name:"AHA BHA PHA 30 Days Miracle Toner",bn:"AHA BHA PHA ৩০ ডেজ মিরাকল টোনার",category:"skincare",price:1390,tag:"EXFOLIATING CARE",pack:"SOME BY MI\nMIRACLE TONER",packClass:"round",desc:"AHA, BHA ও PHA সমন্বিত এক্সফোলিয়েটিং টোনার। নতুন ব্যবহারকারীরা প্যাচ টেস্ট করে ধীরে শুরু করুন এবং দিনের বেলায় সানস্ক্রিন ব্যবহার করুন।"}
];

const copy = {
  bn:{announcement:"কোরিয়ান বিউটি পণ্য এখন আপনার হাতের নাগালে",shop:"শপ",about:"আমাদের সম্পর্কে",promise:"আমাদের প্রতিশ্রুতি",contact:"যোগাযোগ",cart:"কার্ট",heroEyebrow:"K-BEAUTY, SELECTED WITH CARE",heroTitle:"কোরিয়ান বিউটির\nনতুন ঠিকানা।",heroText:"বিশ্বস্ত কোরিয়ান স্কিনকেয়ার ও কসমেটিকস পণ্য বেছে নিন সহজে। আপনার পছন্দের পণ্য পৌঁছে যাবে বাংলাদেশের ঠিকানায়।",explore:"পণ্য দেখুন",heroBottom:"আসল পণ্যের প্রতি অঙ্গীকার · সহজ অর্ডার · বাংলাদেশে ডেলিভারি",trust1:"পণ্য যাচাইয়ের অঙ্গীকার",trust2:"বাংলাদেশজুড়ে অর্ডার",trust3:"সহজ কার্ট ও চেকআউট",curated:"THE KORDESH EDIT",productsTitle:"পছন্দের কোরিয়ান বিউটি",productsSub:"প্রতিদিনের স্কিনকেয়ার রুটিনের জন্য বাছাই করা কিছু জনপ্রিয় পণ্য।",all:"সব পণ্য",skincare:"স্কিনকেয়ার",suncare:"সানকেয়ার",sample:"নমুনা পণ্য ও আনুমানিক মূল্য",ourApproach:"OUR APPROACH",editorialTitle:"সঠিক পণ্য।\nসচেতন পছন্দ।",editorialText:"KORDESH-এর লক্ষ্য হলো কোরিয়ান বিউটি পণ্য বাংলাদেশি ক্রেতাদের কাছে সহজে পৌঁছে দেওয়া। পণ্যের তথ্য, মূল্য ও অর্ডার প্রক্রিয়া থাকবে পরিষ্কার ও সহজ।",learnMore:"আরও জানুন ↗",contactTitle:"আপনার পছন্দের পণ্য\nখুঁজে পেতে সাহায্য চাই?",contactText:"পণ্য, অর্ডার বা ডেলিভারি বিষয়ে আমাদের সঙ্গে যোগাযোগ করুন।",rights:"সর্বস্বত্ব সংরক্ষিত।",yourCart:"আপনার কার্ট",subtotal:"সাবটোটাল",shippingNote:"ডেলিভারি চার্জ চেকআউটে যোগ হবে।",checkout:"অর্ডার সম্পন্ন করুন",checkoutTitle:"অর্ডার তথ্য",fullName:"আপনার নাম",phone:"মোবাইল নম্বর",district:"জেলা",area:"এলাকা / থানা",address:"সম্পূর্ণ ঠিকানা",note:"অর্ডার নোট (ঐচ্ছিক)",delivery:"ডেলিভারি এলাকা",total:"সর্বমোট",paymentHint:"পেমেন্ট ও ডেলিভারি নিশ্চিত করতে অর্ডারটি WhatsApp-এও পাঠানো হবে।",placeOrder:"অর্ডার নিশ্চিত করুন",add:"কার্টে যোগ করুন",added:"কার্টে যোগ হয়েছে",empty:"আপনার কার্ট এখন খালি।",remove:"বাদ দিন",inside:"ঢাকার ভেতরে",outside:"ঢাকার বাইরে",needItem:"অর্ডার করতে আগে কার্টে পণ্য যোগ করুন।",orderSent:"অর্ডারের তথ্য প্রস্তুত হয়েছে। WhatsApp খুলে অর্ডারটি পাঠিয়ে দিন।",sheetPending:"Google Sheets সংযোগ এখনো সেটআপ করা হয়নি। অর্ডারটি WhatsApp-এ পাঠানো যাবে।",sheetSent:"অর্ডারের তথ্য Google Sheets-এ পাঠানো হয়েছে।",whatsappMissing:"WhatsApp নম্বর সেটআপ করা হয়নি। KORDESH-এর নম্বর যুক্ত করতে হবে।",error:"অর্ডার পাঠানো যায়নি। আবার চেষ্টা করুন অথবা WhatsApp-এ যোগাযোগ করুন."},
  en:{announcement:"Korean beauty, now closer to you",shop:"Shop",about:"About",promise:"Our promise",contact:"Contact",cart:"Cart",heroEyebrow:"K-BEAUTY, SELECTED WITH CARE",heroTitle:"Your new address\nfor Korean beauty.",heroText:"Discover Korean skincare and cosmetics with ease. Your favourites, delivered to addresses across Bangladesh.",explore:"Explore products",heroBottom:"Product-care promise · Easy ordering · Bangladesh delivery",trust1:"Product verification commitment",trust2:"Orders across Bangladesh",trust3:"Simple cart and checkout",curated:"THE KORDESH EDIT",productsTitle:"Korean beauty favourites",productsSub:"A considered selection for your everyday skincare routine.",all:"All products",skincare:"Skincare",suncare:"Sun care",sample:"Sample products and indicative prices",ourApproach:"OUR APPROACH",editorialTitle:"Thoughtful products.\nConscious choices.",editorialText:"KORDESH aims to make Korean beauty products more accessible to customers in Bangladesh, with clear product information, pricing and ordering.",learnMore:"Learn more ↗",contactTitle:"Need help finding\nyour next favourite?",contactText:"Contact us for product, order or delivery enquiries.",rights:"All rights reserved.",yourCart:"Your cart",subtotal:"Subtotal",shippingNote:"Delivery fee is added at checkout.",checkout:"Continue to checkout",checkoutTitle:"Order details",fullName:"Full name",phone:"Mobile number",district:"District",area:"Area / Thana",address:"Full address",note:"Order note (optional)",delivery:"Delivery area",total:"Total",paymentHint:"Your order will also be sent through WhatsApp to confirm payment and delivery.",placeOrder:"Place order",add:"Add to cart",added:"Added to cart",empty:"Your cart is empty.",remove:"Remove",inside:"Inside Dhaka",outside:"Outside Dhaka",needItem:"Add a product to your cart first.",orderSent:"Your order is ready. Open WhatsApp and send the order message.",sheetPending:"Google Sheets is not connected yet. You can still send the order through WhatsApp.",sheetSent:"Order details sent to Google Sheets.",whatsappMissing:"WhatsApp number is not configured yet.",error:"Could not submit the order. Please try again or contact us on WhatsApp."}
};

let language = "bn";
let cart = JSON.parse(localStorage.getItem("kordesh-cart") || "[]");
const $ = id => document.getElementById(id);
const money = n => "৳" + Number(n).toLocaleString("en-BD");

function tr(key){return copy[language][key] || copy.bn[key] || key}
function productName(p){return language==="bn"?p.bn:p.name}
function renderProducts(filter="all"){
  $("productGrid").innerHTML = products.filter(p=>filter==="all"||p.category===filter).map(p=>`
    <article class="product-card">
      <div class="product-visual"><span class="product-tag">${p.tag}</span><div class="product-pack ${p.packClass}">${p.pack.replace("\n","<br>")}</div></div>
      <div class="product-info"><span class="product-category">${p.brand} · ${p.category==="suncare"?"SUN CARE":"SKINCARE"}</span><h3>${productName(p)}</h3><p>${p.desc}</p>
      <div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">${tr("add")} +</button></div></div>
    </article>`).join("");
}
function saveCart(){localStorage.setItem("kordesh-cart",JSON.stringify(cart));renderCart()}
function cartCount(){return cart.reduce((s,x)=>s+x.qty,0)}
function subtotal(){return cart.reduce((s,x)=>s+x.qty*x.price,0)}
function renderCart(){
  $("cartCount").textContent=cartCount();
  $("cartSubtotal").textContent=money(subtotal());
  $("cartItems").innerHTML=cart.length?cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-line"><div class="mini-visual">${p.brand}</div><div><h4>${productName(p)}</h4><small>${money(p.price)}</small><div class="qty-controls"><button data-qty="-1" data-id="${p.id}">−</button><span>${item.qty}</span><button data-qty="1" data-id="${p.id}">+</button></div></div><button class="remove-item" data-remove="${p.id}">${tr("remove")}</button></div>`
  }).join(""):`<p class="empty-cart">${tr("empty")}</p>`;
}
function openCart(){ $("cartDrawer").classList.add("open");$("overlay").classList.add("show");$("cartDrawer").setAttribute("aria-hidden","false")}
function closePanels(){ $("cartDrawer").classList.remove("open");$("checkoutModal").classList.remove("open");$("overlay").classList.remove("show");$("cartDrawer").setAttribute("aria-hidden","true");$("checkoutModal").setAttribute("aria-hidden","true")}
function deliveryFee(){return $("deliverySelect").value==="inside"?80:130}
function updateTotal(){$("checkoutTotal").textContent=money(subtotal()+deliveryFee())}
function showCheckout(){
  if(!cart.length){alert(tr("needItem"));return}
  closePanels();$("checkoutModal").classList.add("open");$("checkoutModal").setAttribute("aria-hidden","false");$("overlay").classList.add("show");updateTotal();
}
function setLanguage(next){
  language=next;document.documentElement.lang=next;
  document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(copy[next][k])el.textContent=copy[next][k]});
  $("languageToggle").textContent=next==="bn"?"EN":"বাংলা";
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===(document.querySelector(".filter.active")?.dataset.filter||"all")));
  renderProducts(document.querySelector(".filter.active")?.dataset.filter||"all");renderCart();
  $("deliverySelect").options[0].text=next==="bn"?"ঢাকার ভেতরে · ৳৮০":"Inside Dhaka · ৳80";
  $("deliverySelect").options[1].text=next==="bn"?"ঢাকার বাইরে · ৳১৩০":"Outside Dhaka · ৳130";
  updateTotal();
}
function orderMessage(order){
  const lines=order.items.map(i=>`• ${i.name} × ${i.qty} = ${money(i.price*i.qty)}`).join("\n");
  return `KORDESH ORDER REQUEST\nOrder ID: ${order.orderId}\nName: ${order.customer.name}\nPhone: ${order.customer.phone}\nDistrict: ${order.customer.district}\nArea: ${order.customer.area}\nAddress: ${order.customer.address}\n\nItems:\n${lines}\n\nSubtotal: ${money(order.subtotal)}\nDelivery: ${money(order.deliveryFee)}\nTotal: ${money(order.total)}\nDelivery zone: ${order.deliveryZone}\nNote: ${order.customer.note||"N/A"}`;
}
async function submitOrder(event){
  event.preventDefault();
  if(!cart.length){$("orderStatus").textContent=tr("needItem");return}
  const form=new FormData(event.target);
  const customer={name:form.get("name").trim(),phone:form.get("phone").trim(),district:form.get("district").trim(),area:form.get("area").trim(),address:form.get("address").trim(),note:form.get("note").trim()};
  if(!/^\+?[0-9\s-]{10,16}$/.test(customer.phone)){ $("orderStatus").textContent=language==="bn"?"সঠিক মোবাইল নম্বর দিন।":"Enter a valid phone number."; $("orderStatus").className="order-status error";return}
  const order={orderId:"KD"+Date.now().toString().slice(-9),createdAt:new Date().toISOString(),customer,items:cart.map(i=>{const p=products.find(x=>x.id===i.id);return{id:p.id,name:p.bn,englishName:p.name,brand:p.brand,price:p.price,qty:i.qty}}),subtotal:subtotal(),deliveryFee:deliveryFee(),deliveryZone:form.get("delivery")==="inside"?"Inside Dhaka":"Outside Dhaka",total:subtotal()+deliveryFee(),currency:"BDT"};
  const msg=orderMessage(order);
  $("placeOrderButton").disabled=true;$("placeOrderButton").textContent=language==="bn"?"পাঠানো হচ্ছে...":"Submitting...";
  let sheetOk=false;
  if(CONFIG.SHEETS_WEB_APP_URL.startsWith("https://script.google.com/")){
    try{await fetch(CONFIG.SHEETS_WEB_APP_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(order)});sheetOk=true}catch(e){console.error(e)}
  }
  const wa=CONFIG.WHATSAPP_NUMBER.replace(/\D/g,"");
  if(wa.length>=11&&!wa.includes("XXXXXXXX")){
    window.open("https://wa.me/"+wa+"?text="+encodeURIComponent(msg),"_blank");
    $("orderStatus").textContent=sheetOk?tr("sheetSent"):tr("orderSent");$("orderStatus").className="order-status";
    cart=[];saveCart();event.target.reset();updateTotal();
  }else{
    $("orderStatus").textContent=tr("whatsappMissing")+" "+(sheetOk?tr("sheetSent"):tr("sheetPending"))+" Order ID: "+order.orderId;
    $("orderStatus").className="order-status error";
  }
  $("placeOrderButton").disabled=false;$("placeOrderButton").textContent=tr("placeOrder");
}
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");if(add){const id=add.dataset.add;const found=cart.find(x=>x.id===id);found?found.qty++:cart.push({id,qty:1,price:products.find(p=>p.id===id).price});saveCart();add.textContent=tr("added");setTimeout(()=>add.textContent=tr("add")+" +",1100)}
  const qty=e.target.closest("[data-qty]");if(qty){const item=cart.find(x=>x.id===qty.dataset.id);item.qty+=Number(qty.dataset.qty);if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);saveCart()}
  const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(x=>x.id!==remove.dataset.remove);saveCart()}
  const filter=e.target.closest("[data-filter]");if(filter){document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));filter.classList.add("active");renderProducts(filter.dataset.filter)}
});
$("openCart").addEventListener("click",openCart);$("closeCart").addEventListener("click",closePanels);$("overlay").addEventListener("click",closePanels);$("closeCheckout").addEventListener("click",closePanels);$("checkoutButton").addEventListener("click",showCheckout);$("deliverySelect").addEventListener("change",updateTotal);$("checkoutForm").addEventListener("submit",submitOrder);$("languageToggle").addEventListener("click",()=>setLanguage(language==="bn"?"en":"bn"));
$("contactWhatsApp").href="https://wa.me/"+CONFIG.WHATSAPP_NUMBER;
$("year").textContent=new Date().getFullYear();
renderProducts();renderCart();