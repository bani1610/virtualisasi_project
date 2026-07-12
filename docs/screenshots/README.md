# Indeks Screenshot Dokumentasi Laporan

Semua screenshot telah dikelompokkan sesuai bagian laporan.
Nama file menggunakan format: `[nomor-poin]-[deskripsi].png`

---

## 4.2 — Router MikroTik

| File | Command | Keterangan |
|------|---------|------------|
| `4.2.1-ip-address-print.png` | `/ip address print` | IP: ether1 (WAN 10.0.2.15), ether2 (DMZ 7.7.7.5/30), ether3 (LAN 192.168.54.1/24) |
| `4.2.2-ip-route-and-nat-print.png` | `/ip route print` + `/ip firewall nat print` | Routing table + 3 rule NAT (masquerade + 2 dst-nat ke Nginx) |

---

## 4.3 — Firewall Filter MikroTik

| File | Isi | Rule # |
|------|-----|--------|
| `4.3.1-firewall-filter-rule0-6.png` | `/ip firewall filter print` | Rule 0-6: accept established, drop invalid, allow ping, SSH LAN only, detect & drop port scan |
| `4.3.2-firewall-filter-rule7-13.png` | lanjutan | Rule 7-13: drop all input, allow HTTP/HTTPS, block container port, rate limit, allow DMZ->DB MySQL |
| `4.3.3-firewall-filter-rule10-16.png` | lanjutan | Rule 10-16: lengkap sampai drop blacklist |

---

## 4.4 — Nginx

| File | Command | Keterangan |
|------|---------|------------|
| `4.4.1-app-conf.png` | `cat /etc/nginx/sites-available/app.conf` | Konfigurasi Nginx: 2 server block, security headers, proxy_pass |
| `4.4.2-nginx-test.png` | `sudo nginx -t` | syntax is ok + test is successful |
| `4.4.3-curl-header-app1.png` | `curl -I -H "Host: app1.local" http://127.0.0.1` | Header: X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| `4.4.4-curl-header-app2.png` | `curl -I -H "Host: app2.local" http://127.0.0.1` | Sama seperti App1 |

---

## 4.5 — Docker & Aplikasi

| File | Command | Keterangan |
|------|---------|------------|
| `4.5.1-docker-ps.png` | `docker ps` | app1 (3000) + app2 (3001) status Up |
| `4.5.2-docker-whoami.png` | `docker exec app1 whoami` + `docker exec app2 whoami` | Output: appuser (bukan root) |
| `4.5.3-browser-app1.png` | Browser 192.168.8.20:3000 | "Halo dari App1!" |
| `4.5.4-browser-app2.png` | Browser 192.168.8.20:3001 | "Halo dari App2!" |

---

## 4.6 — Database

| File | Command | Keterangan |
|------|---------|------------|
| `4.6.1-show-databases.png` | `SHOW DATABASES;` | app1_db, app2_db terlist |
| `4.6.2-app1db-app2db-tables.png` | `USE app1_db/app2_db; SHOW TABLES; SELECT *` | Tabel users (Budi, Ani) + products (Kopi, Teh) |
| `4.6.3-mysql-users.png` | `SELECT user, host FROM mysql.user;` | app1_user@7.7.7.6, app2_user@7.7.7.6 |
| `4.6.4-ufw-status.png` | `sudo ufw status verbose` | 3306 ALLOW IN 7.7.7.6 |

---

## 4.7 — Suricata

| File | Command | Keterangan |
|------|---------|------------|
| `4.7.1-custom-rules.png` | `sudo cat /etc/suricata/rules/custom.rules` | 3 rule: SQLi, XSS, Port Scan |
| `4.7.2-simulasi-serangan.png` | `nmap -sS 7.7.7.6` + `curl SQLi` | Simulasi dari Ubuntu-DBServer |
| `4.7.3-alert-eve-json.png` | `eve.json | jq select(...)` | Alert sid:1000001 (SQLi) + sid:1000003 (Port Scan) |

---

## 6 — Hasil Pengujian

| File | Skenario | Hasil |
|------|----------|-------|
| `6.1-ping-router-dan-dmz.png` | ping 192.168.54.1 + ping 7.7.7.6 dari DBServer | BERHASIL (0% loss) |
| `6.2-ping-windows-ke-dmz-dan-curl.png` | ping + curl dari Windows ke 7.7.7.6 | Ping timeout (ICMP block), curl dijalankan |
| `6.3-curl-direct-container-port-blocked.png` | curl :3000 + :3001 dari Windows | BLOCKED (no response) |
| `6.4-mysql-dmz-ke-db-berhasil.png` | mysql dari DMZ ke 192.168.54.10 | BERHASIL masuk MariaDB |
| `6.5-mysql-windows-ke-db-gagal.png` | mysql dari Windows ke 192.168.54.10 | ERROR 2003 - Can't connect |
| `6.6-nginx-access-log.png` | tail -20 app1_access.log + app2_access.log | Log request: timestamp, IP, method, status 200 |
| `6.7-blacklist-dan-rate-limit.png` | Blacklist + rate limit test | Address-list blacklist aktif |

---

## Screenshot yang Perlu Ditambah

| Poin | Yang Kurang |
|------|-------------|
| 4.2 | `/file print` setelah export .rsc (bukti file ada) + isi file .rsc |
| 6 | Rate limit: `for i in {1..60}; do curl...` - screenshot kode 429/drop di request ke-50+ |
