<?php
/*
 * This file is part of the MediaWiki extension Popups..
 *
 * Popups is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * Popups is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Popups.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @file
 * @ingroup extensions
 */

$messages = array();

/**
 * English
 */
$messages['en'] = array(
	'popups-message' => 'Popups',
	'popups-desc' => 'Displays popups with summaries of page contents when the user hovers over a page link.',
	'popups-last-edited' => 'Last edited $1',
	'popups-redirects' => 'redirects to <h3>$1</h3>',
);

/** Message documentation (Message documentation)
 * @author Shirayuki
 */
$messages['qqq'] = array(
	'popups-message' => 'Name shown in user preference for this extension',
	'popups-desc' => '{{desc|name=Popups|url=https://www.mediawiki.org/wiki/Extension:Popups}}',
	'popups-last-edited' => 'Message to show time span since the page was last edited. $1 is the timespan in words.',
	'popups-redirects' => 'Message shown when the popup is showing a redirected page',
);

/** Arabic (العربية)
 * @author Asaifm
 */
$messages['ar'] = array(
	'popups-message' => 'المنبثقات',
	'popups-desc' => 'يقوم بعرض منبثقات بملخصات عن محتوى الصفحة عندما يقوم المستخدم بحوم المؤشر على رابط الصفحة',
);

/** Asturian (asturianu)
 * @author Xuacu
 */
$messages['ast'] = array(
	'popups-message' => 'Ventanos emerxentes',
	'popups-desc' => "Amuesa ventanos emerxentes con resumes del conteníu de la páxina cuando l'usuariu pasa'l mur per un enllaz de páxina",
	'popups-edited-seconds' => 'Última edición hai {{PLURAL:$1|$1 segundu|$1 segundos}}',
	'popups-edited-minutes' => 'Última edición hai {{PLURAL:$1|$1 minutu|$1 minutos}}',
	'popups-edited-hours' => 'Última edición hai {{PLURAL:$1|$1 hora|$1 hores}}',
	'popups-edited-days' => 'Última edición {{PLURAL:$1|ayeri|hai $1 díes}}.',
	'popups-edited-years' => 'Última edición hai {{PLURAL:$1|$1 añu|$1 años}}',
	'popups-redirects' => 'redireiciona a <h3>$1</h3>',
);

/** Bengali (বাংলা)
 * @author Aftab1995
 */
$messages['bn'] = array(
	'popups-message' => 'পপআপ',
	'popups-edited-seconds' => 'সর্বশেষ সম্পাদনা {{PLURAL:$1|১ সেকেন্ড|$1 সেকেন্ড}} আগে।',
	'popups-edited-minutes' => 'সর্বশেষ সম্পাদনা {{PLURAL:$1|১ মিনিট|$1 মিনিট}} আগে।',
	'popups-edited-hours' => 'সর্বশেষ সম্পাদনা {{PLURAL:$1|১ ঘণ্টা|$1 ঘণ্টা}} আগে।',
	'popups-edited-days' => 'সর্বশেষ সম্পাদনা {{PLURAL:$1|গতকাল|$1 দিন আগে}}।',
	'popups-edited-years' => 'সর্বশেষ সম্পাদনা {{PLURAL:$1|১ বছর|$1 বছর}} আগে।',
);

/** Chechen (нохчийн)
 * @author Умар
 */
$messages['ce'] = array(
	'popups-message' => 'Гучу долу кор',
	'popups-edited-seconds' => 'Язйина {{PLURAL:$1|$1 секунд}} хьалха.',
	'popups-edited-minutes' => 'Язйина {{PLURAL:$1|$1 минут}} хьалха.',
	'popups-edited-hours' => 'Язйина {{PLURAL:$1|$1 сахьт}} хьалха.',
	'popups-edited-days' => 'Язйина {{PLURAL:$1|$1 де}} хьалха.',
	'popups-edited-years' => 'Язйина {{PLURAL:$1|$1 шо}} хьалха.',
	'popups-redirects' => 'дӀасахӀажайо <h3>$1</h3> тӀе',
);

/** German (Deutsch)
 * @author Metalhead64
 */
$messages['de'] = array(
	'popups-message' => 'Popups',
	'popups-desc' => 'Ermöglicht beim Überfahren mit der Maus über einen Seitenlink die Anzeige von Popups mit Seiteninhaltszusammenfassungen',
	'popups-edited-seconds' => 'Zuletzt bearbeitet vor {{PLURAL:$1|einer Sekunde|$1 Sekunden}}.',
	'popups-edited-minutes' => 'Zuletzt bearbeitet vor {{PLURAL:$1|einer Minute|$1 Minuten}}.',
	'popups-edited-hours' => 'Zuletzt bearbeitet vor {{PLURAL:$1|einer Stunde|$1 Stunden}}.',
	'popups-edited-days' => 'Zuletzt bearbeitet {{PLURAL:$1|gestern|vor $1 Tagen}}.',
	'popups-edited-years' => 'Zuletzt bearbeitet vor {{PLURAL:$1|einem Jahr|$1 Jahren}}.',
	'popups-redirects' => 'leitet weiter auf <h3>$1</h3>',
);

/** Esperanto (Esperanto)
 * @author KuboF
 */
$messages['eo'] = array(
	'popups-redirects' => 'alidirektiloj al <h3>$1</h3>',
);

/** Spanish (español)
 * @author Fitoschido
 */
$messages['es'] = array(
	'popups-message' => 'Cuadros de información de artículos',
	'popups-desc' => 'Muestra recuadros emergentes con el resumen del contenido de un artículo cuando el usuario posa el ratón sobre un enlace.',
	'popups-edited-seconds' => 'Última modificación: hace {{PLURAL:$1|1 segundo|$1 segundos}}.',
	'popups-edited-minutes' => 'Última modificación: hace {{PLURAL:$1|1 minuto|$1 minutos}}.',
	'popups-edited-hours' => 'Última modificación: hace {{PLURAL:$1|1 hora|$1 horas}}.',
	'popups-edited-days' => 'Última modificación: {{PLURAL:$1|ayer|hace $1 días}}.',
	'popups-edited-years' => 'Última modificación: hace {{PLURAL:$1|1 año|$1 años}}.',
);

/** Persian (فارسی)
 * @author Armin1392
 */
$messages['fa'] = array(
	'popups-message' => 'پوپاپ‌ها',
	'popups-desc' => 'نمایش پوپاپ‌ها با خلاصه‌های محتواهای صفحه هنگامی که کاربر منتظر یک لینک صفحه است.',
	'popups-edited-seconds' => 'آخرین ویرایش شده {{PLURAL:$1|$1 ثانیه|$1 ثانیه‌ها}} پیش.',
	'popups-edited-minutes' => 'آخرین ویرایش شده {{PLURAL:$1|۱ دقیقه|$1 دقیقه}} پیش.',
	'popups-edited-hours' => 'آخرین ویرایش شده {{PLURAL:$1|۱ ساعت|$1 ساعت}} پیش.',
	'popups-edited-days' => 'آخرین ویرایش شده {{PLURAL:$1|دیروز|$1 روز پیش}}.',
	'popups-edited-years' => 'آخرین ویرایش شده {{PLURAL:$1|۱ سال|$1 سال}} پیش.',
	'popups-redirects' => 'تغییر مسیرها به <h3>$1</h3>',
);

/** French (français)
 * @author Gomoko
 * @author VIGNERON
 */
$messages['fr'] = array(
	'popups-message' => 'Fenêtres popup',
	'popups-desc' => 'Afficher des fenêtres popup avec les résumés des contenus des pages quand l’utilisateur survole le lien d’une page',
	'popups-edited-seconds' => 'Dernière modification il y a {{PLURAL:$1|1 seconde|$1 secondes}}.',
	'popups-edited-minutes' => 'Dernière modification il y a {{PLURAL:$1|1 minute|$1 minutes}}.',
	'popups-edited-hours' => 'Dernière modification il y a {{PLURAL:$1|1 heure|$1 heures}}.',
	'popups-edited-days' => 'Dernière modification il y a {{PLURAL:$1|hier|$1 jours}}.',
	'popups-edited-years' => 'Dernière modification il y a {{PLURAL:$1|1 an|$1 ans}}.',
	'popups-redirects' => 'redirigé vers <h3>$1</h3>',
);

/** Hebrew (עברית)
 * @author Amire80
 */
$messages['he'] = array(
	'popups-message' => 'חלונות קופצים',
	'popups-desc' => 'הצגת חלונות קופצים עם סיכומים של תוכן הדף כאשר משתמש עובר מעל קישור לדף',
	'popups-edited-seconds' => 'נערך לאחרונה לפני {{PLURAL:$1|שנייה אחת|$1 שניות}}.',
	'popups-edited-minutes' => 'נערך לאחרונה לפני {{PLURAL:$1|דקה אחת|$1 דקות}}.',
	'popups-edited-hours' => 'נערך לאחרונה לפני {{PLURAL:$1|שעה אחת|שעתיים|$1 שעות}}.',
	'popups-edited-days' => 'נערך לאחרונה {{PLURAL:$1|אתמול|לפני יומיים|לפני $1 ימים}}.',
	'popups-edited-years' => 'נערך לאחרונה {{PLURAL:$1|לפני שנה|לפני שנתיים|לפני $1 שנים}}.',
	'popups-redirects' => 'מפנה לדף <h3>$1</h3>',
);

/** Italian (italiano)
 * @author Beta16
 */
$messages['it'] = array(
	'popups-message' => 'Popup',
	'popups-desc' => "Mostra un popup con un estratto del contenuto quando l'utente passa sopra al collegamento ad una pagina",
);

/** Japanese (日本語)
 * @author Shirayuki
 * @author Whym
 */
$messages['ja'] = array(
	'popups-message' => 'ポップアップ',
	'popups-desc' => 'ページへのリンクにホバーしたとき、ページ内容の要約のポップアップが表示されます。',
	'popups-edited-seconds' => '{{PLURAL:$1|$1秒}}前に最終更新。',
	'popups-edited-minutes' => '{{PLURAL:$1|$1分}}前に最終更新。',
	'popups-edited-hours' => '{{PLURAL:$1|$1時間}}前に最終更新。',
	'popups-edited-days' => '{{PLURAL:$1|$1日}}前に最終更新。',
	'popups-edited-years' => '{{PLURAL:$1|$1年}}前に最終更新。',
);

/** Korean (한국어)
 * @author Priviet
 */
$messages['ko'] = array(
	'popups-message' => '팝업',
	'popups-desc' => '사용자가 문서 링크에 마우스를 갖다대면 문서 내용 요약을 팝업으로 표시',
	'popups-edited-seconds' => '{{PLURAL:$1|$1초}} 전에 마지막으로 편집함.',
	'popups-edited-minutes' => '{{PLURAL:$1|$1분}} 전에 마지막으로 편집함',
	'popups-edited-hours' => '{{PLURAL:$1|$1시간}} 전에 마지막으로 편집함',
	'popups-edited-days' => '{{PLURAL:$1|어제|$1일 전}}에 마지막으로 편집함.',
	'popups-edited-years' => '{{PLURAL:$1|$1년}} 전에 마지막으로 편집함',
	'popups-redirects' => '<h3>$1</h3> 문서로 넘겨주기',
);

/** Luxembourgish (Lëtzebuergesch)
 * @author Robby
 */
$messages['lb'] = array(
	'popups-message' => 'Popups',
	'popups-edited-seconds' => 'Lescht Ännerung {{PLURAL:$1|virun enger Sekonn|viru(n) $1 Sekonnen}}.',
	'popups-edited-minutes' => 'Lescht Ännerung {{PLURAL:$1|virun enger Minutt|viru(n) $1 Minutten}}.',
	'popups-edited-hours' => 'Lescht Ännerung {{PLURAL:$1|virun enger Stonn|viru(n) $1 Stonnen}}.',
	'popups-edited-days' => 'Lescht Ännerung {{PLURAL:$1|gëschter|viru(n) $1 Deeg}}',
	'popups-edited-years' => 'Lescht Ännerung {{PLURAL:$1|virun engem Joer|viru(n) $1 Joer}}.',
	'popups-redirects' => 'Viruleedung op <h3>$1</h3',
);

/** Malagasy (Malagasy)
 * @author Jagwar
 */
$messages['mg'] = array(
	'popups-desc' => "Mampiseho popup misy ny ambangovangom-botoatim-pejy rehefa mandalo eo ambonin'ilay rohim-pejy ny mpampiasa",
	'popups-edited-minutes' => 'Niova farany $1{{PLURAL:$1}} minitra ago.',
);

/** Macedonian (македонски)
 * @author Bjankuloski06
 */
$messages['mk'] = array(
	'popups-message' => 'Скокачки прозорчиња',
	'popups-desc' => 'Прикажува скокачки прозорчиња со резиме на содржината на страницата кога ќе отидете со стрелката врз дадената врска',
	'popups-edited-seconds' => 'Последните измени се направени пред {{PLURAL:$1|една секунда|$1 секунди}}.',
	'popups-edited-minutes' => 'Последните измени се направени пред {{PLURAL:$1|една минута|$1 минути}}.',
	'popups-edited-hours' => 'Последните измени се направени пред {{PLURAL:$1|еден час|$1 часа}}.',
	'popups-edited-days' => 'Последните измени се направени {{PLURAL:$1|вчера|пред $1 дена}}.',
	'popups-edited-years' => 'Последните измени се направени пред {{PLURAL:$1|една година|$1 години}}.',
	'popups-redirects' => 'пренасочува кон <h3>$1</h3>',
);

/** Marathi (मराठी)
 * @author V.narsikar
 */
$messages['mr'] = array(
	'popups-message' => 'उचकण्या',
	'popups-desc' => 'जेंव्हा सदस्य एखाद्या लेखदुव्यावर घुटमळतो तेंव्हा, लेखाच्या आशय सारांशासह उचकण्या दर्शविते',
	'popups-edited-seconds' => 'शेवटचे संपादन {{PLURAL:$1|$1 सेकंदा|$1 सेकंदां}}पूर्वी',
	'popups-edited-minutes' => 'शेवटचे संपादन {{PLURAL:$1|$1 मिनिटा|$1 मिनिटां}}पूर्वी',
	'popups-edited-hours' => 'शेवटचे संपादन {{PLURAL:$1|$1 तासा|$1 तासां}}पूर्वी',
	'popups-edited-days' => 'शेवटचे संपादन {{PLURAL:$1|काल|$1 दिवसांपूर्वी}}.',
	'popups-edited-years' => 'शेवटचे संपादन {{PLURAL:$1|१ वर्षा|$1 वर्षां}}पूर्वी',
	'popups-redirects' => '<h3>$1</h3>ला पुनर्निर्देशित करते',
);

/** Dutch (Nederlands)
 * @author SPQRobin
 * @author Sjoerddebruin
 */
$messages['nl'] = array(
	'popups-message' => 'Pop-ups',
	'popups-redirects' => 'verwijst door naar <h3>$1</h3>',
);

/** Occitan (occitan)
 * @author Cedric31
 */
$messages['oc'] = array(
	'popups-message' => 'Fenèstras popup',
	'popups-redirects' => 'redirigit cap a <h3>$1</h3>',
);

/** Polish (polski)
 * @author Chrumps
 */
$messages['pl'] = array(
	'popups-message' => 'Okna pop-up',
	'popups-desc' => 'Wyświetla okna pop-up z opisami treści artykułów po umieszczeniu wskaźnika myszy na odnośniku.',
	'popups-edited-seconds' => 'Ostatnio zmodyfikowano {{PLURAL:$1|1 sekundę|$1 sekundy|$1 sekund}} temu.',
	'popups-edited-minutes' => 'Ostatnio zmodyfikowano {{PLURAL:$1|1 minutę|$1 minuty|$1 minut}} temu.',
	'popups-edited-hours' => 'Ostatnio zmodyfikowano {{PLURAL:$1|1 godzinę|$1 godziny|$1 godzin}} temu.',
	'popups-edited-days' => 'Ostatnio zmodyfikowano {{PLURAL:$1|wczoraj|$1 dni temu}}.',
	'popups-edited-years' => 'Ostatnio zmodyfikowano {{PLURAL:$1|rok|$1 lata|$1 lat}} temu.',
	'popups-redirects' => 'przekierowuje do<h3>$1</h3>',
);

/** Pashto (پښتو)
 * @author Ahmed-Najib-Biabani-Ibrahimkhel
 */
$messages['ps'] = array(
	'popups-message' => 'بربوکيزې',
	'popups-desc' => 'بربوکيزې د يو مخ د مېنځپانگې لنډيزونه هغه وخت ښکاره کوي کله چې کارن د موږک غشی د يوه مخ پر تړنې راولي',
	'popups-edited-seconds' => 'تېر سمون {{PLURAL:$1|1 ثانيه|$1 ثانيې}} دمخه شوی.',
	'popups-edited-minutes' => 'تېر سمون {{PLURAL:$1|1 دقيقه|$1 دقيقې}} دمخه شوی.',
	'popups-edited-hours' => 'تېر سمون {{PLURAL:$1|1 ساعت|$1 ساعتونه}} دمخه شوی.',
	'popups-edited-days' => 'تېر سمون {{PLURAL:$1|پرون|$1 ورځې دمخه}} شوی.',
	'popups-edited-years' => 'تېر سمون {{PLURAL:$1|1 کال|$1 کالونه}} دمخه شوی.',
	'popups-redirects' => '<h3>$1</h3> ته مخ ورگرځونې',
);

/** Portuguese (português)
 * @author Imperadeiro98
 * @author SandroHc
 */
$messages['pt'] = array(
	'popups-message' => 'Pop-ups',
	'popups-desc' => 'Exibe pop-ups com resumos do conteúdo de páginas quando o usuário passa o rato por cima do link de uma página',
	'popups-redirects' => 'redireciona para <h3>$1</h3>',
);

/** Russian (русский)
 * @author Okras
 */
$messages['ru'] = array(
	'popups-message' => 'Всплывающие окна',
	'popups-desc' => 'Отображает всплывающие окна с описанием содержания страницы, когда пользователь наводит курсор на ссылку, ведущую на страницу',
	'popups-edited-seconds' => 'Отредактировано {{PLURAL:$1|$1 секунду|$1 секунд|$1 секунды}} назад.',
	'popups-edited-minutes' => 'Отредактировано {{PLURAL:$1|$1 минуту|$1 минут|$1 минуты}} назад.',
	'popups-edited-hours' => 'Отредактировано {{PLURAL:$1|$1 час|$1 часов|$1 часа}} назад.',
	'popups-edited-days' => 'Отредактировано {{PLURAL:$1|вчера|$1 дней|$1 дня}} назад.',
	'popups-edited-years' => 'Отредактировано {{PLURAL:$1|$1 год|$1 лет|$1 года}} назад.',
	'popups-redirects' => 'перенаправляет на <h3>$1</h3>',
);

/** Scots (Scots)
 * @author John Reid
 */
$messages['sco'] = array(
	'popups-message' => 'Popups',
	'popups-desc' => 'Displays popups wi owerviews o page contents whan the uiser hovers ower ae page link.',
	'popups-edited-seconds' => 'Last eidited {{PLURAL:$1|1 second|$1 seconds}} syne.',
	'popups-edited-minutes' => 'Last eidited {{PLURAL:$1|1 minute|$1 minutes}} syne.',
	'popups-edited-hours' => 'Laist eidited {{PLURAL:$1|1 hour|$1 hours}} syne.',
	'popups-edited-days' => 'Last edited {{PLURAL:$1|yesterday|$1 days ago}}.',
	'popups-edited-years' => 'Laist eidited {{PLURAL:$1|1 year|$1 years}} syne.',
	'popups-redirects' => 'redirects til <h3>$1</h3>',
);

/** Serbian (Cyrillic script) (српски (ћирилица)‎)
 * @author Rancher
 */
$messages['sr-ec'] = array(
	'popups-redirects' => 'преусмерења на <h3>$1</h3>',
);

/** Swedish (svenska)
 * @author Lokal Profil
 * @author WikiPhoenix
 */
$messages['sv'] = array(
	'popups-message' => 'Popup-fönster',
	'popups-desc' => 'Visar popup-fönster med sammanfattningar av sidans innehåll när användaren för muspekaren över en sidlänk.',
	'popups-edited-seconds' => 'Senast redigerad {{PLURAL:$1|1 sekund|$1 sekunder}} sedan.',
	'popups-edited-minutes' => 'Senast redigerad {{PLURAL:$1|1 minut|$1 minuter}} sedan.',
	'popups-edited-hours' => 'Senast redigerad {{PLURAL:$1|1 timme|$1 timmar}} sedan.',
	'popups-edited-days' => 'Senast redigerad {{PLURAL:$1|igår|$1 dagar}} sedan.',
	'popups-edited-years' => 'Senast redigerad {{PLURAL:$1|1 år|$1 år}} sedan.',
	'popups-redirects' => 'omdirigeringar till <h3>$1</h3>',
);

/** Telugu (తెలుగు)
 * @author Chaduvari
 * @author Ravichandra
 */
$messages['te'] = array(
	'popups-message' => 'బుడగలు',
	'popups-edited-seconds' => 'చివరిసారిగా {{PLURAL:$1|1 సెకండు|$1 సెకండ్ల}} కిందట మార్చబడింది.',
	'popups-edited-minutes' => 'చివరిసారిగా {{PLURAL:$1|1 నిమిషం|$1 నిమిషాల}} కిందట మార్చబడింది.',
	'popups-edited-hours' => 'చివరిసారిగా {{PLURAL:$1|1 గంట|$1 గంటల}} కిందట మార్చబడింది.',
	'popups-edited-days' => 'చివరిసారిగా {{PLURAL:$1|నిన్న|$1 రోజుల కిందట}} మార్చబడింది.',
	'popups-edited-years' => 'చివరిసారిగా {{PLURAL:$1|ఏడాది|$1 సంవత్సరాల}} కిందట మార్చబడింది.',
);

/** Turkish (Türkçe)
 * @author Joseph
 */
$messages['tr'] = array(
	'popups-message' => 'Açılır pencereler',
	'popups-desc' => 'Kullanıcı bir makale bağlantısı üzerine geldiğinde makale içeriği özetini içeren açılır pencereler görüntüler.',
	'popups-edited-seconds' => 'En son {{PLURAL:$1|1 saniye|$1 saniye}} önce değiştirildi.',
	'popups-edited-minutes' => 'En son {{PLURAL:$1|1 dakika|$1 dakika}} önce değiştirildi.',
	'popups-edited-hours' => 'En son {{PLURAL:$1|1 saat|$1 saat}} önce değiştirildi.',
	'popups-edited-days' => 'En son {{PLURAL:$1|dün|$1 gün önce}} değiştirildi.',
	'popups-edited-years' => 'En son {{PLURAL:$1|1 yıl|$1 yıl}} önce değiştirildi.',
);

/** Ukrainian (українська)
 * @author Andriykopanytsia
 */
$messages['uk'] = array(
	'popups-message' => 'Спливні вікна',
	'popups-desc' => 'Відображає спливні вікна з описом змісту статей при наведенні покажчика миші на посилання.',
	'popups-edited-seconds' => 'Останнє редагування $1 {{PLURAL:$1|секунду|секунди|секунд}} назад',
	'popups-edited-minutes' => 'Відредаговано {{PLURAL:$1|$1 хвилину|$1 хвилин|$1 хвилини}} назад.',
	'popups-edited-hours' => 'Остання зміна $1 {{PLURAL:$1|годину|годин|години}} тому',
	'popups-edited-days' => 'Відредаговано {{PLURAL:$1|вчора|$1 днів тому|$1 дні тому}}.',
	'popups-edited-years' => 'Відредаговано {{PLURAL:$1|$1 рік|$1 років|$1 роки}} тому.',
	'popups-redirects' => 'перенаправляє на <h3>$1</h3>',
);

/** Vietnamese (Tiếng Việt)
 * @author Minh Nguyen
 * @author Skye Darcy
 */
$messages['vi'] = array(
	'popups-redirects' => 'đổi hướng đến <h3>$1</h3>',
);

/** Yiddish (ייִדיש)
 * @author פוילישער
 */
$messages['yi'] = array(
	'popups-edited-seconds' => 'לעצט רעדאקטירט פֿאַר {{PLURAL:$1|1 סעקונדע|$1 סעקונדעס}}',
	'popups-edited-minutes' => 'לעצט רעדאקטירט פֿאַר {{PLURAL:$1|1 מינוט|$1 מינוט}}',
	'popups-edited-hours' => "לעצט דערהײַנטיקט פֿאַר {{PLURAL:$1|$1 שעה|$1 שעה'ן}}",
	'popups-edited-days' => 'לעצט רעדאקטירט {{PLURAL:$1|נעכטן|פאר $1 טעג}}.',
	'popups-redirects' => 'פירט ווײַטערפירונג צו <h3>$1</h3>',
);

/** Simplified Chinese (中文（简体）‎)
 * @author Liuxinyu970226
 * @author Yfdyh000
 */
$messages['zh-hans'] = array(
	'popups-message' => '弹窗',
	'popups-desc' => '当用户悬停页面链接时显示对应页面内容摘要的弹窗',
	'popups-edited-seconds' => '上次编辑于$1秒前。',
	'popups-edited-minutes' => '上次编辑于$1分钟前。',
	'popups-edited-hours' => '上次编辑于$1小时前。',
	'popups-edited-days' => '上次编辑于$1天前。',
	'popups-edited-years' => '上次编辑于$1年前。',
	'popups-redirects' => '重定向到<h3>$1</h3>',
);

/** Traditional Chinese (中文（繁體）‎)
 * @author Liuxinyu970226
 */
$messages['zh-hant'] = array(
	'popups-message' => '快顯視窗',
	'popups-desc' => '黨用戶懸停頁面鏈接時顯示頁面內容摘要的快顯視窗',
	'popups-edited-seconds' => '最近編輯於$1秒前。',
	'popups-edited-minutes' => '最近編輯於$1分鐘前。',
	'popups-edited-hours' => '最近編輯於$1小時前。',
	'popups-edited-days' => '最近編輯於$1天前。',
	'popups-edited-years' => '最近編輯於$1年前。',
	'popups-redirects' => '重定向至<h3>$1</h3>',
);
