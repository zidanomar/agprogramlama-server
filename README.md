<h1  align="center">Ağ Programlama Server</h1>

# Repo İçeriği
- Socket programlama ile mesajlaşma uygulamasının backend işlemlerini içeren kodlar buradadır
- Sunulan özellikler:Jwt authentication-veri tabanı bağlantısı ,gerçek zamanlı ve uçtan-uca şifreli mesajlaşma,kullanıcı işlemleri ,login-signup...
## Projeyi Çalıştırmak İçin

1. Git repository'sini klonlayın: `git clone https://github.com/zidanomar/agprogramlama-server.git`
2. Gerekli bağımlılıkları yükleyin:  `npm install`

3. Proje ana dizininde `.env` dosyasını oluşturun. 

4. `.env.example` dosyasındaki ayarları `.env` dosyasına kopyalayın.
(``` Not: .env dosyasını sonradan oluşturma sebebimiz, yazılım standart prosedürlerini takip ettiğimi için, gizli kurulum dosyalarının Git üzerinde paylaşılmaması gerekliliği nedeniyle yapılmaktadır. ```)
5. Postgre bağlantınızı ayarlayın.(```Şifreniz .env den farklı ise .env dosyasını kendi ayarlarınızı güncelleyin```)
6. Veritabanı migration'larını ayarlamak için aşağıdaki komutu kullanın:
 `npx prisma migrate dev`
7. ```npm start``` ile programın backendini başlatın
- <img src="https://github.com/zidanomar/agprogramlama-server/assets/96066271/bdc99976-377c-4130-be71-b796b8d5d0d8" width="500" alt="image">
### Veri Tabanı Dizaynı
- <img src="https://github.com/kaygisizkamil/readme/assets/96066271/a9c98baf-ca55-482f-98ab-5516d98b921b" width="500" alt="image">
