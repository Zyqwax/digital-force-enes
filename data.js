/* ============================================================
   DATA.JS — 100 Ünlü · 100 Yemek · 52 Kart
   ============================================================ */

const CELEBS_RAW = [
  'Atatürk','Sezen Aksu','Tarkan','Kemal Sunal','Bülent Ersoy',
  'Barış Manço','Orhan Pamuk','Haluk Bilginer','Çağatay Ulusoy','Tuba Büyüküstün',
  'Halit Ergenç','Mert Fırat','Cansu Dere','Kıvanç Tatlıtuğ','Elçin Sangu',
  'Yılmaz Erdoğan','Şener Şen','Zeki Müren','Ajda Pekkan','İbrahim Tatlıses',
  'Orhan Gencebay','Erol Evgin','Hande Yener','Hadise','Mehmet Ali Erbil',
  'Hakan Şükür','Arda Turan','Emre Belözoğlu','Yıldız Tilbe','Sıla Gençoğlu',
  'Gökhan Özen','Müzeyyen Senar','Zülfü Livaneli','Yaşar Kemal','Demet Akalın',
  'Bergüzar Korel','Nurgül Yeşilçay','Beren Saat','Engin Altan Düzyatan','Burak Özçivit',
  'Fahriye Evcen','Özge Gürel','Serkan Çayoğlu','Hande Erçel','Kerem Bürsin',
  'Michael Jackson','Madonna','Elvis Presley','Freddie Mercury','David Bowie',
  'Leonardo DiCaprio','Tom Hanks','Meryl Streep','Angelina Jolie','Brad Pitt',
  'Johnny Depp','Will Smith','Denzel Washington','Morgan Freeman','Al Pacino',
  'Robert De Niro','Keanu Reeves','Tom Cruise','Scarlett Johansson','Emma Watson',
  'Taylor Swift','Beyoncé','Rihanna','Eminem','Jay-Z',
  'Adele','Ed Sheeran','Justin Bieber','Lady Gaga','Billie Eilish',
  'Albert Einstein','Stephen Hawking','Nikola Tesla','Charles Darwin','Isaac Newton',
  'Elon Musk','Steve Jobs','Bill Gates','Mark Zuckerberg','Jeff Bezos',
  'Barack Obama','Nelson Mandela','Mahatma Gandhi','Napoleon Bonaparte','Shakespeare',
  'Mozart','Beethoven','Pablo Picasso','Vincent van Gogh','Leonardo da Vinci',
  'Cristiano Ronaldo','Lionel Messi','Muhammad Ali','Michael Jordan','Usain Bolt',
  'Roger Federer','Tiger Woods','Serena Williams','LeBron James','Zlatan Ibrahimovic',
];

const FOODS_RAW = [
  'Mercimek Çorbası','Ezogelin Çorbası','Domates Çorbası','Iskembe Çorbası','Tarhana Çorbası',
  'Adana Kebap','Urfa Kebap','Döner','Köfte','Şiş Kebap',
  'İskender','Ciğer','Lahmacun','Pide','Börek',
  'Gözleme','Menemen','Çılbır','Sucuklu Yumurta','Kaşarlı Omlet',
  'Baklava','Kadayıf','Künefe','Sütlaç','Aşure',
  'Helva','Lokum','Tulumba','Revani','Şekerpare',
  'Pilav','Bulgur Pilavı','İç Pilav','Kuru Fasulye','Nohut',
  'Güveç','Etli Türlü','Bamya','İmam Bayıldı','Karnıyarık',
  'Biber Dolması','Yaprak Sarma','Zeytinyağlı Enginar','Patlıcan Kebabı','Hünkarbeğendi',
  'Tandır','Çöp Şiş','Tavuk Şiş','Tavuk Döner','Balık Ekmek',
  'Hamsi','Levrek','Çupra','Karides Güveç','Meze',
  'Haydari','Cacık','Humus','Tarama','Çerkez Tavuğu',
  'Kısır','Şakşuka','Çoban Salata','Gavurdağı Salatası','Piyaz',
  'Paça','Kellepaça','Tantuni','Etli Ekmek','Mantı',
  'Simit','Açma','Poğaça','Su Böreği','Sigara Böreği',
  'Güllaç','Dondurma','Bülbül Yuvası','Kazandibi','Profiterol',
  'Çiğ Köfte','Kumpir','Kokoreç','Midye Dolma','Islak Hamburger',
  'Tatlı Mısır','Acuka','Muhammara','Alinazik','Sac Kavurma',
  'Gözleme Ispanaklı','Şehriyeli Çorba','Baldo Pilavı','Toyga Çorbası','Fıstıklı Sarma',
  'Pasta','Profiterol','Keşkül','Tavuk Göğsü','Kaymaklı Ekmek Kadayıfı',
];

const CARDS_RAW = (() => {
  const suits    = ['♠','♥','♦','♣'];
  const suitName = { '♠':'Maça', '♥':'Kupa', '♦':'Karo', '♣':'Sinek' };
  const ranks    = ['As','2','3','4','5','6','7','8','9','10','Vale','Kız','Kral'];
  const isRed    = s => s === '♥' || s === '♦';
  const cards = [];
  for (const s of suits)
    for (const r of ranks)
      cards.push({ name:`${r} ${suitName[s]}`, suit: s, isRed: isRed(s) });
  return cards;
})();
