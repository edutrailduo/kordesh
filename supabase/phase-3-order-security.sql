-- KORDESH Phase 3: authoritative product pricing and checkout validation
-- Applied to Supabase project bibithkwfrwahttdkcfi on 2026-11-10.
-- Safe to re-run: catalog upserts, policies/triggers are replaced idempotently.

create table if not exists public.kordesh_catalog (
 product_id text primary key,
 product_name text not null,
 english_name text not null,
 brand text not null,
 price numeric(12,2) not null check (price >= 0),
 active boolean not null default true,
 updated_at timestamptz not null default now()
);
alter table public.kordesh_catalog enable row level security;
revoke all on public.kordesh_catalog from public, anon, authenticated;
grant select on public.kordesh_catalog to anon, authenticated;
drop policy if exists "Public can view active KORDESH products" on public.kordesh_catalog;
create policy "Public can view active KORDESH products"
on public.kordesh_catalog for select to anon, authenticated using (active = true);

insert into public.kordesh_catalog(product_id,product_name,english_name,brand,price,active)
values
('anua-heartleaf-77','হার্টলিফ ৭৭% সুদিং টোনার','Heartleaf 77% Soothing Toner','ANUA',1450,true),
('boj-relief-sun','রিলিফ সান: রাইস + প্রোবায়োটিকস SPF50+','Relief Sun: Rice + Probiotics SPF50+','BEAUTY OF JOSEON',1550,true),
('cosrx-snail-96','অ্যাডভান্সড স্নেইল ৯৬ মিউসিন এসেন্স','Advanced Snail 96 Mucin Essence','COSRX',1650,true),
('skin1004-ampoule','মাদাগাস্কার সেন্টেলা অ্যাম্পুল','Madagascar Centella Ampoule','SKIN1004',1750,true),
('roundlab-sun','বার্চ জুস ময়েশ্চারাইজিং সান ক্রিম','Birch Juice Moisturizing Sun Cream','ROUND LAB',1690,true),
('somebymi-toner','AHA BHA PHA ৩০ ডেজ মিরাকল টোনার','AHA BHA PHA 30 Days Miracle Toner','SOME BY MI',1390,true),
('carenel-alpha-arbutin','ক্যারেনেল আলফা আরবুটিন গ্লুটাথায়ন ক্রিম','Derma Alpha Arbutin Glutathione Whitening Cream','Care:Nel',1350,true),
('axisy-dark-spot','ডার্ক স্পট কারেক্টিং গ্লো সিরাম','Dark Spot Correcting Glow Serum','AXIS-Y',1299,true),
('cosrx-salicylic-cleanser','স্যালিসিলিক অ্যাসিড ডেইলি জেন্টল ক্লেনজার','Salicylic Acid Daily Gentle Cleanser','COSRX',1100,true),
('anua-niacinamide-txa','নিয়াসিনামাইড ১০% + TXA ৪% সিরাম','Niacinamide 10% + TXA 4% Dark Spot Correcting Serum','ANUA',2200,true),
('skin1004-tone-brightening','সেন্টেলা টোন ব্রাইটেনিং ক্যাপসুল অ্যাম্পুল','Madagascar Centella Tone Brightening Capsule Ampoule','SKIN1004',900,true),
('cosrx-snail-combo','স্নেইল এসেন্স ও ক্রিম কম্বো','Advanced Snail Essence + Snail Cream Combo','COSRX',3200,true),
('thefaceshop-rice-combo','রাইস ওয়াটার ক্লেনজার ও রাইস সিরামাইড ক্রিম সেট','Rice Water Bright Cleanser & Rice Ceramide Moisture Cream Combo','THE FACE SHOP',2249,true),
('celimax-retinal-shot','ভিটা-এ রেটিনাল শট টাইটেনিং বুস্টার','The Vita-A Retinal Shot Tightening Booster','CELIMAX',1600,true),
('ksecret-eye-cream','সিউল ১৯৮৮ রেটিনাল আই ক্রিম','Seoul 1988 Eye Cream Retinal Liposome 4% + Fermented Bean','K-SECRET',1490,true),
('vt-reedle-shot-100','রিডল শট ১০০','Reedle Shot 100','VT COSMETICS',2700,true),
('seapuri-scalpy-serum','স্ক্যাল্পি হেয়ার সিরাম','Scalpy Hair Serum','SEAPURI',2100,true),
('tenzero-sun-cushion','পারফেক্ট UV সান কুশন SPF50+','Perfect UV Sun Cushion SPF50+ PA++++','TENZERO',1490,true),
('tenzero-glutathione-cream','সিগনেচার গ্লুটাথায়ন নারিশিং ক্রিম','Signature Nourishing Cream Glutathione','TENZERO',1200,true),
(' iunik-beta-glucan','বিটা গ্লুকান 3X ব্যারিয়ার ক্রিম','Beta Glucan 3X Barrier Cream','IUNIK',1900,true),
('aestura-atobarrier','এটোব্যারিয়ার ৩৬৫ ক্রিম','AtoBarrier 365 Cream','AESTURA',999,true),
('pororo-baby-suncream','বেবি সানক্রিম SPF50+','Baby Suncream SPF50+','PORORO',1100,true),
('marymay-retinol-pdrn','স্পিকিউল রেটিনল PDRN ক্রিম','Spicule Retinol PDRN Cream','MARY & MAY',1199,true),
('drrejuall-pdrn','অ্যাডভান্সড PDRN রিজুভেনেটিং ক্রিম','Advanced PDRN Rejuvenating Cream','DR. REJU-ALL',3200,true),
('aplb-body-lotion','ট্রানেক্সামিক অ্যাসিড নিয়াসিনামাইড বডি লোশন','Tranexamic Acid Niacinamide Body Lotion','APLB',1600,true),
('pore-minimizing-21','পোর মিনিমাইজিং ২১ সিরাম','Pore Minimizing 21 Serum','Pore Minimizing',1550,true),
('skin1004-hyalu-sun','হায়ালু-সিকা ওয়াটার-ফিট সান সিরাম','Madagascar Centella Hyalu-Cica Water-Fit Sun Serum','SKIN1004',1490,true),
('carenel-scalp-tonic','হাই ইনটেনসিটি স্ক্যাল্প টনিক','High Intensity Anti Hair Loss Scalp Tonic','Care:Nel',1500,true),
('aplb-beauty-tablet','গ্লুটাথায়ন নিয়াসিনামাইড বিউটি ট্যাবলেট','Glutathione Niacinamide Beauty Tablet 500mg x30','APLB',999,true),
('mise-en-scene-serum','পারফেক্ট সিরাম অরিজিনাল','Perfect Serum Original','MISE EN SCENE',1500,true),
('kundal-baby-bodywash','হানি অ্যান্ড ম্যাকাডামিয়া বডি ওয়াশ বেবি পাউডার','Honey & Macadamia Pure Body Wash Baby Powder','KUNDAL',2100,true),
('kundal-baby-treatment','হানি অ্যান্ড ম্যাকাডামিয়া হেয়ার ট্রিটমেন্ট','Honey & Macadamia Treatment Baby Powder','KUNDAL',2100,true),
('plu-baby-bodywash','বেবি পাউডার পারফিউম বডি ওয়াশ','Nature and Perfume Body Wash Baby Powder','PLU',3250,true),
('greenfinger-baby-soap','ইনটেনসিভ বেবি সোপ','Intensive Baby Soap','GREEN FINGER',799,true),
('greenfinger-baby-shampoo','ইনটেনসিভ বেবি শ্যাম্পু','Intensive Baby Shampoo','GREEN FINGER',1750,true),
('greenfinger-baby-foam','বেবি ফোমিং ওয়াশ','Baby Foaming Wash','GREEN FINGER',2100,true),
('greenfinger-baby-lotion','বেবি লোশন','Baby Lotion','GREEN FINGER',1900,true),
('greenfinger-face-cream','প্যানথেডিন বেবি ফেস ক্রিম','Panthedin Baby Face Cream','GREEN FINGER',1500,true),
('greenfinger-intensive-lotion','ইনটেনসিভ লোশন','Intensive Lotion','GREEN FINGER',1725,true),
('greenfinger-forest-lotion','ফরেস্ট বডি লোশন','Forest Body Lotion','GREEN FINGER',2175,true),
('greenfinger-forest-wash','ফরেস্ট বডি ওয়াশ','Forest Body Wash Mild Nuts','GREEN FINGER',2700,true),
('oriox-lip-balm','পিচ ময়েশ্চার লিপ বাম SPF15','Peach Moisture Lip Balm SPF15','ORIOX',350,true),
('pyunkang-baby-cream-herb','কিডস অ্যান্ড বেবি ক্রিম সুইট হার্ব','Kids & Baby Cream Sweet Herb','PYUNKANG YUL',2300,true),
('pyunkang-baby-cream-orange','কিডস অ্যান্ড বেবি ক্রিম সুইট অরেঞ্জ','Kids & Baby Cream Sweet Orange','PYUNKANG YUL',2300,true),
('pyunkang-baby-sun','কিডস অ্যান্ড বেবি সান ক্রিম','Kids & Baby Sun Cream','PYUNKANG YUL',1350,true),
('pyunkang-baby-moisture-sun','কিডস অ্যান্ড বেবি ময়েশ্চার সান ক্রিম','Kids & Baby Moisture Sun Cream','PYUNKANG YUL',1700,true),
('pyunkang-baby-cleanser','কিডস অ্যান্ড বেবি টিয়ার-ফ্রি ক্লেনজিং ফোম','Kids & Baby Tear Free Cleansing Foam','PYUNKANG YUL',1900,true),
('roundlab-baby-lotion','বেবি মাইল্ড লোশন','Baby Mild Lotion','ROUND LAB',2500,true),
('dabo-baby-shampoo','বেবি পাউডার পারফিউম শ্যাম্পু','Baby Powder Perfume Shampoo','DABO',1750,true),
('kundal-teatree-shampoo','টি ট্রি ম্যাকাডামিয়া ক্লেনজিং শ্যাম্পু','Tea Tree & Macadamia Pure Natural Cleansing Shampoo Baby Powder','KUNDAL',3400,true),
('pyunkang-baby-shampoo','কিডস অ্যান্ড বেবি শ্যাম্পু','Kids & Baby Shampoo Baby Powder','PYUNKANG YUL',2300,true),
('pyunkang-baby-lotion-powder','কিডস অ্যান্ড বেবি লোশন বেবি পাউডার','Kids & Baby Lotion Baby Powder','PYUNKANG YUL',2300,true),
('pyunkang-baby-lotion-herb','কিডস অ্যান্ড বেবি লোশন সুইট হার্ব','Kids & Baby Lotion Sweet Herb','PYUNKANG YUL',2300,true),
('pyunkang-baby-lotion-orange','কিডস অ্যান্ড বেবি লোশন সুইট অরেঞ্জ','Kids & Baby Lotion Sweet Orange','PYUNKANG YUL',2300,true),
('pyunkang-baby-wash','কিডস অ্যান্ড বেবি ওয়াশ সুইট হার্ব','Kids & Baby Wash Sweet Herb','PYUNKANG YUL',2100,true),
('pyunkang-bubble-wash','টিয়ার-ফ্রি টপ টু টো বাবল ওয়াশ','Kids & Baby Tear Free Top To Toe Bubble Wash','PYUNKANG YUL',2300,true),
('greenfinger-premium-shampoo','প্রিমিয়াম বেবি শ্যাম্পু','Premium Baby Shampoo','GREEN FINGER',3100,true),
('greenfinger-baby-wash','বেবি ওয়াশ','Baby Wash','GREEN FINGER',2900,true),
('greenfinger-premium-lotion','প্রিমিয়াম বেবি লোশন','Premium Baby Lotion','GREEN FINGER',3300,true),
('kundal-diffuser','পারফিউম ডিফিউজার বেবি পাউডার','Perfume Diffuser Baby Powder 2 EA','KUNDAL',2900,true),
('kundal-car-diffuser','কার ডিফিউজার বেবি পাউডার','Perfume Car Diffuser Baby Powder 2 EA','KUNDAL',1700,true),
('drrejuall-max','অ্যাডভান্সড PDRN রিজুভেনেটিং ক্রিম MAX','Advanced PDRN Rejuvenating Cream MAX','DR. REJU-ALL',6500,true),
('kundal-sys-set','শ্যাম্পু ও ট্রিটমেন্ট সেট','x SYS PLANET Shampoo & Treatment Set','KUNDAL',6200,true),
('kundal-white-musk-set','হানি ম্যাকাডামিয়া হোয়াইট মাস্ক সেট','Honey & Macadamia White Musk Edition Shampoo + Treatment Set','KUNDAL',5900,true),
('dalba-volufiline','ইনটেনসিভ ভলুফিলিন গ্রাইন্ডিং ক্রিম','Intensive Volufiline Grinding Cream','d''Alba',5900,true),
('cleardea-mucin','মিউসিন কোলাজেন ক্রিম অ্যাম্পুল','Mucin Collagen Cream Ampoule','CLEAR DEA',5050,true),
('axisy-glow-set','গ্লো কেয়ার সেট','Glow Care Set','AXIS-Y',4500,true),
('dalba-double-serum','হোয়াইট ট্রাফল ডাবল লেয়ার রিভাইটালাইজিং সিরাম','White Truffle Double Layer Revitalizing Serum','d''Alba',4500,true),
('dalba-serum-cream','হোয়াইট ট্রাফল ডাবল সিরাম ও ক্রিম','White Truffle Double Serum & Cream','d''Alba',4500,true),
('dalba-eye-patch','হোয়াইট ট্রাফল আই প্যাচ','White Truffle Intensive The Real Eye Patch','d''Alba',4300,true),
('mixsoon-bean-combo','বিন এসেন্স ও ক্রিম কম্বো','Bean Essence & Cream Combo','mixsoon',4200,true),
('kundal-cherry-set','চেরি ব্লসম শ্যাম্পু ও ট্রিটমেন্ট ডুও','Honey & Macadamia Shampoo and Treatment Duo Cherry Blossom','KUNDAL',4200,true),
('tirtir-ceramic-cream','সেরামিক ক্রিম','Ceramic Cream','TIRTIR',4200,true),
('dalba-moisture-cream','হোয়াইট ট্রাফল ডাবল ময়েশ্চার ক্রিম','White Truffle Double Moisture Cream','d''Alba',4100,true),
('rejuran-ampoule','ডুয়াল ইফেক্ট অ্যাম্পুল','Dual Effect Ampoule','REJURAN',4100,true),
('rejuran-cream','নিউট্রিটিভ ক্রিম c-PDRN ০.২%','Nutritive Cream c-PDRN 0.2%','REJURAN',4100,true),
('cleardea-collagen','কোলাজেন ভলিউমিং ক্রিম অ্যাম্পুল','Collagen Voluming Cream Ampoule','CLEAR DEA',3800,true),
('cleardea-wrinkle','মিউসিন ডিপ রিংকেল শট','Mucin Collanetinal Deep Wrinkle Shot','CLEAR DEA',3800,true),
('aromatica-scalp-kit','রোজমেরি স্ক্যাল্প ট্রিটমেন্ট কিট','Rosemary Scalp Treatment Kit','AROMATICA',3800,true),
('threewclinic-shampoo','অলিভ অ্যান্ড আরগান ২-ইন-১ শ্যাম্পু','Olive and Argan 2 IN 1 Shampoo','3W CLINIC',3700,true),
('dalba-spray-ampoule','ইনটেনসিভ ভলুফিলিন স্প্রে অ্যাম্পুল','Intensive Volufiline Spray Ampoule','d''Alba',3700,true),
('dalba-serum-30','হোয়াইট ট্রাফল ডাবল লেয়ার সিরাম','White Truffle Double Layer Revitalizing Serum','d''Alba',3700,true),
('dalba-vita-cream','ভিটা টোনিং ক্যাপসুল ক্রিম','Vita Toning Capsule Cream','d''Alba',3700,true),
('medicube-soyxidil','সয়ক্সিডিল শ্যাম্পু','Soyxidil Shampoo','MEDICUBE',3700,true),
('anua-toner-500','হার্টলিফ ৭৭% সুদিং টোনার','Heartleaf 77% Soothing Toner','ANUA',3500,true)
on conflict(product_id) do update set product_name=excluded.product_name,english_name=excluded.english_name,brand=excluded.brand,price=excluded.price,active=true,updated_at=now();

create or replace function public.kordesh_validate_order()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
 item jsonb;
 product_row record;
 qty_value integer;
 subtotal_value numeric(12,2) := 0;
 normalized_items jsonb := '[]'::jsonb;
 seen_ids text[] := array[]::text[];
 delivery_value numeric(12,2);
 product_id_value text;
 phone_value text;
begin
 if jsonb_typeof(new.items) <> 'array' or jsonb_array_length(new.items) < 1 or jsonb_array_length(new.items) > 30 then
   raise exception 'Invalid order items';
 end if;
 if length(trim(coalesce(new.customer_name,''))) < 2 or length(trim(coalesce(new.customer_name,''))) > 120 then
   raise exception 'Please enter a valid customer name';
 end if;
 phone_value := regexp_replace(coalesce(new.customer_phone,''), '[ -]', '', 'g');
 if phone_value !~ '^(\+?88)?01[3-9][0-9]{8}$' then
   raise exception 'Please enter a valid Bangladesh mobile number';
 end if;
 if nullif(trim(coalesce(new.customer_district,'')),'') is null
    or nullif(trim(coalesce(new.customer_area,'')),'') is null
    or nullif(trim(coalesce(new.customer_address,'')),'') is null then
   raise exception 'District, area and address are required';
 end if;
 if new.delivery_zone = 'Inside Dhaka' then delivery_value := 80;
 elsif new.delivery_zone = 'Outside Dhaka' then delivery_value := 130;
 else raise exception 'Invalid delivery zone';
 end if;
 for item in select value from jsonb_array_elements(new.items)
 loop
   product_id_value := item->>'id';
   if product_id_value is null or product_id_value = any(seen_ids) then
     raise exception 'Invalid or duplicate product in order';
   end if;
   if coalesce(item->>'qty','') !~ '^[1-9][0-9]?$' then
     raise exception 'Invalid product quantity';
   end if;
   qty_value := (item->>'qty')::integer;
   select c.product_id,c.product_name,c.english_name,c.brand,c.price
   into product_row
   from public.kordesh_catalog c
   where c.product_id = product_id_value and c.active = true;
   if not found then raise exception 'A product is unavailable. Please refresh your cart.'; end if;
   seen_ids := array_append(seen_ids, product_id_value);
   subtotal_value := subtotal_value + product_row.price * qty_value;
   normalized_items := normalized_items || jsonb_build_array(jsonb_build_object(
     'id',product_row.product_id,
     'name',product_row.product_name,
     'englishName',product_row.english_name,
     'brand',product_row.brand,
     'price',product_row.price,
     'qty',qty_value
   ));
 end loop;
 new.customer_name := trim(new.customer_name);
 new.customer_phone := phone_value;
 new.customer_district := trim(new.customer_district);
 new.customer_area := trim(new.customer_area);
 new.customer_address := trim(new.customer_address);
 new.customer_note := left(coalesce(new.customer_note,''),1000);
 new.items := normalized_items;
 new.subtotal := subtotal_value;
 new.delivery_fee := delivery_value;
 new.total := subtotal_value + delivery_value;
 new.status := 'pending';
 return new;
end;
$$;

drop trigger if exists kordesh_validate_order_before_insert on public.kordesh_orders;
create trigger kordesh_validate_order_before_insert
before insert on public.kordesh_orders
for each row execute function public.kordesh_validate_order();
