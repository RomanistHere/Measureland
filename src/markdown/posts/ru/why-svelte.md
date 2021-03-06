---
slug: why-svelte
title: Почему мы выбрали Svelte, а не React или Angular?
firstDate: 2021-11-30
date: 2022-03-29
description: Мы сравниваем популярные "фреймворки" с инструментами для строительства и объясняю почему мы выбрали Svelte. Знание программирования не обязательно.
tags: [technology]
layout: article
author: Роман Смунёв
---

<script>
    import TextLink from "$lib/components/ui-elements/TextLink.svelte";
</script>

Знание программирования не обязательно. Попробуем разобраться с помощью аналогии.

### Что за "фреймворки" (Svelte, React, Preact и т.д.)?

Создание приложения чем-то похоже на строительство дома. Предлагаю представить, что мы (ты, мой читатель, и я) собираемся построить небольшое здание. Это и есть моя аналогия. Доски, брёвна и планки будем условно считать ШТМЛем (HTML) и ЦССом (CSS). "Фреймворки" же будут нашими наборами инструментов, с помощью которых мы будем строить.

#### Angular (Ангуляр).

Почти совершенный набор инструментов на все случаи жизни. Их ну очень много: молотки на каждый размер гвоздя, а также инструменты, о существовании которых мы даже не подозревали. Будет непросто понять как это всё использовать и где их хранить.

Сразу закрадывается мысль, что можно найти один молоток и использовать только его, но это смешно - иметь так много всего, и ничего не попробовать. Да и не по инструкции. К слову о ней, инструкции есть у всего (да-да, включая молотки) - они добротно написаны, но могут быть длинными и сложными. Написано, что иногда нужно будет забивать обычные гвозди (восьмидесятку и сотку) сваезабивателем, чтобы вся конструкция оставалась прочной и надёжной...

Это всё возможно и было бы полезно, если бы мы строили небоскрёбы и имели большую команду, но для обычного дома (даже многоэтажного) мы решаем что это чересчур.

Стоит заметить, что если бы мы имели большую команду и строили небоскрёбы, они, скорее всего, не были бы лучшими в округе. Посетители бы застревали в лифтах, путались бы в этажах и т.д. <TextLink href="https://cscalfani.medium.com/goodbye-object-oriented-programming-a59cda4c0e53" blank={true} text="Прости, ООП... (англ)" />

#### React/Preact (Реакт и Преакт).

На минуту представим что <s>Apple</s> Facebook делает наборы строительных инструментов... Они выглядят очень клёво - есть специальный стартовый набор с надписью "всё для строительства дома" - очень продуманно. Нам настолько нравится, что хочется <s>просто трогать</s> показывать соседям свои инструменты.

Ладно, неважно - перейдём к строительству. Спустя несколько часов - дней мы начинаем понимать, что почти всем инструментам чего-то не достаёт. Нам приходится снова и снова возвращаться в магазин, чтобы купить нужные гвозди, свёрла и т.д. Причём не всё есть в нашем оригинальном магазине. Нам приходится искать другие - к счастью, многие из наших соседей уже использовали Реакт и с радостью нам подсказывают где найти нужный магазин и какой инструмент купить. Часть из них вообще переквалифицировалась и теперь делает и продает инструменты людям вроде нас.

Это неприятно, но не смертельно. Гораздо больше удручает факт, которым с нами поделились более опытные строители. Если за нашей "стройкой" никто не следит - никто не проверяет правильность наших действий - велика вероятность, что мы допустим серьёзные ошибки и даже не заметим их. И это серьёзно аукнется рано или поздно. Огромное обилие различных подходов и отсутствие внятных инструкций о том как использовать наши инструменты в строительстве чего-то крупнее скворечника запутывают нас окончательно.

#### Vue (Вью).

Я не настолько эксперт во Vue, чтобы написать что-то забавное и интересное здесь, поэтому приглашаю сразу перейти к Svelte. Если захочется, присылай мне свой вариант с Vue, я обязательно его размещу, если он будет подходить по формату.

#### Svelte (Свелт).

Тут тоже есть небольшой стартовый набор. Но всё ощущается и выглядит по-другому - многообещающе после Реакта и Ангуляра. В воздухе магазина витает атмосфера "помощи" а не "продажи". Сам магазин не выглядит как-будто он принадлежит какой-то крупной конторе: не очень большой, и мы можем увидеть владельца в зале - он помогает покупателям с выбором, рассказывает как правильно пользоваться его инструментами. Звучит довольно просто. Но мы уже не такие доверчивые!

"Мы хотим посмотреть как много свёрл в стартовом наборе!"

Наш ассистент улыбается. Мы открываем упаковку и там оказывается несколько разных видов - больше чем было в Реакте и меньше чем в Ангуляре. Ассистент говорит, что это универсальные свёрла - их будет достаточно для 80% работ.

"Почему не 100?" - выпаливаем мы.

"Тогда бы пришлось увеличить размер упаковки до размеров небольшой комнаты. Мы выверяем их количество на основе наблюдений. Видите ли, мы не так давно открылись и не гарантируем, что это количество идеально. Попробуйте сами, и если у вас будет другое мнение, свяжитесь с нами, мы что-нибудь придумаем.

"Звучит разумно" - думаем мы про себя...

Инструкции оказываются тоже довольно простыми. Небоскрёб я бы по ним строить не стал, но обычный дом - вполне. Многие инструменты сами поддерживают определённые подходы, к которым мы вскоре привыкаем.

#### ... После того как закончили строительство...

Выглядит адекватно. Осталось несколько вещей, которые мы доделаем когда прибудут новые инструменты. Часть из них была не очень удобной - мы решаем сообщить об этом в магазин. В остальном... Было довольно просто и приятно. Особенно для первого опыта с этими инструментами.

"Как тебе в целом?" - ты задаёшь вопрос.

"Мне понравилось, думаю что мы можем попробовать с этим Свелтом что-то ещё, а ты что думаешь?" - я отвечаю тебе.

Каков будет твой ответ? :)

### JavaScript vs TypeScript (ДжаваСкрипт против ТайпСкрипта).

Я надеюсь, мой читатель понимает, что я не собирался никого обидеть данной статьёй и всё это является исключительно моим мнением и <s>опытом</s> сарказмом. Предлагаю к прочтению ещё немного каламбура. Дай мне знать, нравится тебе или нет.

#### Что в аналогии JavaScript?

Наши руки. Мы можем построить что угодно ими, создать свой набор инструментов и машин и использовать их. А можем строить дом без инструментов. В любом случае это едва ли выглядит адекватной задачей для среднего человека. Поэтому "фреймворки" так распространены.

#### А TypeScript?

Шлем дополненной реальности соединённый с перчатками. Звучит круто! Эта система распознаёт что мы делаем (строим) и проверяет, чтобы мы не делали "ошибок". Например, чтобы мы не забивали гвозди по дереву ни во что кроме древесины или не отпилили кусок деревяшки ножовкой по металлу. Это же так неправильно!

Да, иногда вместо того, чтобы ударить колышек молотком, нам придётся идти искать молот. Но ведь так написано в инструкции! Идёт в комплекте с Ангуляром.

Ещё одна функция это проверка соответствия чертежу (мы должны их нарисовать, да). Это круто, если мы рисуем точные чертежи. Хуже, если они существуют только для галочки. И да, иметь хорошие чертежи перед строительством - это довольно хорошая идея, неважно с ТайпСкриптом или без.

В целом, система может быть как полезной, так и вредной. Очевидно, что при всей своей сложности (распознавание вещей, проверка в реальном времени и т.д.) не может работать идеально быстро и иногда косячит. Цель ТайпСкрипта - ограничить использование инструментов и нашего воображения. Хорошо это или плохо - решать тебе.

### А теперь технические детали. Почему мы выбрали Svelte.

#### Производительность.

<p>
<TextLink href="https://krausest.github.io/js-framework-benchmark/current.html" blank={true} text="Сравнение (бенчмарки)" />. Svelte не самый быстрый. <TextLink href="https://www.solidjs.com/" blank={true} text="Solid (Солид)" />, например, похож (по способу работы) на Svelte, и обгоняет его в скорости во многих тестах. Но Svelte достаточно быстрый, чтобы не переживать об этом. Быстрее большинства. Передаю привет <TextLink href="https://svelte.dev/blog/virtual-dom-is-pure-overhead" blank={true} text="Virtual DOM (англ)" />!
</p>

#### Инструменты из коробки.

SvelteKit: Генерация статичных страниц, роунтинг, симуляция бэкенда. <TextLink href="https://preactjs.com/" blank={true} text="Preact" /> тоже имеет данные опции. 

Svelte: Крутые и полезные утилиты для анимаций и транзишнов. Скоупинг ЦСС (по модулям). Управление состоянием (state) приложения. Реактивность. Компиляция в обычный JS.

#### Что ещё нам понравилось.

JS-в-HTML ощущается гораздо приятнее и удобнее чем HTML-in-JS. В принципе, написание ШТМЛя, ЦССа и ДЖСа в одном файле чувствуется олдскульно и современно (из-за кучи новых функций) в одно и то же время.

#### Что не понравилось.

В целом, немного. Особенности синтаксиса быстро привыкаются. Главное понимать, что SvelteKit ещё не релизнут (хоть и близко), а значит могут быть баги и недоделки, как например i18n и content-security-policy.

#### Комьюнити (сообщество).

Небольшое (а значит шансы найти что-то в интернете сравнительно невелики), но очень активное (а значит можно задать вопрос в дискорде, и он будет отвечен). Как и в случае с Измерией, Svelte ставит свой сообщество на первое место, т.е. нас и наше доверие - что круто в любом виде проектов.

#### Прозрачность.

Да. <TextLink href="https://github.com/sveltejs/svelte" blank={true} text="Открытый код" /> и <TextLink href="https://opencollective.com/svelte" blank={true} text="отсутствие жажды наживы" />. Всё как я люблю.

#### Заключение.

Мы сделали Измерию с помощью Svelte/SvelteKit и очень довольны этим. Я наслаждался процессом и буду рад в будущем работать с этой технологией ещё.

Является ли Svelte будущим? Я не знаю. Для меня он настоящее.
