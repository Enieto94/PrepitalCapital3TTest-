<script lang="ts">
  import { onMount } from 'svelte';
  import { loading, error } from '../stores';
  import axios from 'axios';
  export let id;

  let product = null;

  onMount(async () => {
    loading.set(true);
    try {
      const res = await axios.get(`http://localhost:3001/products/${id}`, {
        headers: { 'x-api-key': '4eb07053-1eb8-4cd0-969a-c163456ff4c1' }
      });
      product = res.data.data;
    } catch (err) {
      error.set("Error cargando el producto");
    } finally {
      loading.set(false);
    }
  });
</script>

{#if $loading}
  <p>Cargando...</p>
{:else if $error}
  <p>{$error}</p>
{:else if product}
  <h2>{product.attributes.name}</h2>
  <p>{product.attributes.description}</p>
  <p>${product.attributes.price}</p>
{/if}
