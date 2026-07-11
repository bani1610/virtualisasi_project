# 2026-07-08 21:22:04 by RouterOS 7.21.5
# system id = XxaNh60sMaL
#
/interface ethernet
set [ find default-name=ether1 ] disable-running-check=no
set [ find default-name=ether2 ] disable-running-check=no
set [ find default-name=ether3 ] disable-running-check=no
/ip address
add address=7.7.7.5/30 interface=ether2 network=7.7.7.4
add address=192.168.56.1/24 interface=ether3 network=192.168.56.0
/ip dhcp-client
add interface=ether1
/ip dns
set allow-remote-requests=yes servers=8.8.8.8,1.1.1.1
/ip firewall address-list
add address=1.2.3.4 comment="contoh IP jahat" list=blacklist
/ip firewall filter
add action=accept chain=forward comment="accept established/related" \
    connection-state=established,related
add action=drop chain=forward comment="drop invalid" connection-state=invalid
add action=accept chain=input comment="allow ping" protocol=icmp
add action=accept chain=input comment="SSH only from LAN" dst-port=22 \
    protocol=tcp src-address=192.168.56.0/24
add action=drop chain=input comment="drop SSH from outside LAN" dst-port=22 \
    protocol=tcp
add action=add-src-to-address-list address-list=port-scanners \
    address-list-timeout=1d chain=input comment="detect port scan" \
    connection-limit=3,32 protocol=tcp
add action=drop chain=input comment="drop scanners" src-address-list=\
    port-scanners
add action=drop chain=input comment="drop all other input"
add action=accept chain=forward comment="allow http/https to nginx" \
    dst-address=7.7.7.6 dst-port=80,443 in-interface=ether1 protocol=tcp
add action=drop chain=forward comment="block direct container port" \
    dst-address=7.7.7.6 dst-port=3000,8080 in-interface=ether1 protocol=tcp
add action=drop chain=forward comment="block other dmz->lan" dst-address=\
    7.7.7.0/30 in-interface=ether1
add action=add-src-to-address-list address-list=rate-limited \
    address-list-timeout=10m chain=forward connection-limit=50,32 dst-port=\
    80,443 protocol=tcp
add action=drop chain=forward src-address-list=rate-limited
add action=accept chain=forward comment="allow dmz->db mysql only" \
    dst-address=192.168.56.10 dst-port=3306 protocol=tcp src-address=7.7.7.6
add action=drop chain=forward comment="block other dmz->lan" dst-address=\
    192.168.56.0/24 src-address=7.7.7.0/30
add action=drop chain=forward comment="block external->lan direct" \
    dst-address=192.168.56.0/24 in-interface=ether1
add action=drop chain=forward comment="drop blacklisted IP" src-address-list=\
    blacklist
/ip firewall nat
add action=masquerade chain=srcnat out-interface=ether1
add action=dst-nat chain=dstnat dst-port=80 in-interface=ether1 protocol=tcp \
    to-addresses=7.7.7.6 to-ports=80
add action=dst-nat chain=dstnat dst-port=443 in-interface=ether1 protocol=tcp \
    to-addresses=7.7.7.6 to-ports=443
