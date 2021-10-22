---
slug: tutorial
title: Советник Измерии. Путеводитель (туториал).
date: 2021-07-20
description: Ключевые моменты Измерии. Как? Что? Зачем
tags: [starters]
layout: article
author: Роман Смунёв
---

<script>
    import Summary from "$lib/components/Blog/Article/Summary.svelte";
</script>

Ниже описаны ключевые моменты Измерии. Как, что и зачем?

<Summary
    text="Зарегистрируйся и подтверди свою почту чтобы оценивать места. Важно оставить оценку по каждому критерию. Комментарии приветствуются и могут быть вознаграждены позже."
/>

### Как оценить место
Для это нужно зарегистрироваться и войти. Если это сделано, найди место, которое ты хочешь оценить и кликни на него. Не стоит пытаться выцелить определённый дом или подъезд. Цель данных рейтингов - получить общую картину о районе или квартале, поэтому такая точность не нужна.

После тебе нужно будет оценить 11 разных пунктов, важно поставить оценку каждому пункту, даже если нет уверенности. <a href="https://habr.com/ru/post/62276/" class="article__link" target="_blank" rel="noopener">Оцени приблизительно.</a>

Три последние пункта считаются дополнительными. Они слабее влияют на общий рейтинг, и тем не менее, будут важны многим.

Комментарий не обязателен, но может быть невероятно полезным. Мы планируем награждать самые практичные комментарии в будущем.


### Не получается
Может быть несколько причин, почему не получается оценить. На экран должна выводиться ошибка, объясняющая ситуацию, например:

- **"Слишком много попыток"** или **"Слишком часто оцениваешь"** отображаются при превышении лимитов использования. <a href="../how-to-become-citizen/" class="article__link">Как убрать лимиты</a>.
- **"Где-то рядом уже есть твоя оценка"** случается если ты пытаешься оценить место недалеко от твоей предыдущей отметки.
- **В остальных случаях возможно это наш косяк.** Приносим извинения. Читай внимательно сообщение об ошибке. Попробуй перезагрузить страницу или вернуться позже.


### Поделиться
Чтобы получить ссылку на необходимый рейтинг нужно открыть его и нажать "Поделиться рейтингом" или скопировать URL - адресную строку - она будет изменяться в зависимости от того, что отображается на экране.

Так что же можно подсвечивать области на карте и делиться ими, об этом ниже.


### Рисовалка
В версии 1.1.0 мы ввели возможность выделять области/районы и делиться ими с другими. На данный момент мы поддерживаем три способа выделения: многоугольник, прямоугольник и круг. Всё это можно найти в правом нижнем углу карты (три верхние иконки соответственно). После клика по одной из иконок, появятся подсказки, что делать дальше. Две нижние иконки - редактирование и удаление.

После каждого действия с фигурами твоя адресная строка (URL) будет изменяться, так что при перезагрузке страницы всё останется как прежде - так же ты можешь скопировать его и отправить другому человеку, чтобы он увидел тоже самое. Прямо сейчас она может достигать очень больших размеров и выглядеть странно, но мы работаем над тем, чтобы это исправить.

Как только адресная строка превысит лимит (2000 символов), высветиться ошибка и попросит удалить тебя часть фигур. После этого ты можешь продолжать рисовать, но изменения уже не будут сохраняться.