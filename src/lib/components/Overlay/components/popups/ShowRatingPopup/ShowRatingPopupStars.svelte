<script>
    export let rating;
    $: rating = Math.round(rating);
</script>

<div class="star-wrapper">
    <span class="star {rating === 5 ? 'star-active' : ''}"></span>
    <span class="star {rating === 4 ? 'star-active' : ''}"></span>
    <span class="star {rating === 3 ? 'star-active' : ''}"></span>
    <span class="star {rating === 2 ? 'star-active' : ''}"></span>
    <span class="star {rating === 1 ? 'star-active' : ''}"></span>
</div>
