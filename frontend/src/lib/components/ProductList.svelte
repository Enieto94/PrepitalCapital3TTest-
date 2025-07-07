<script lang="ts">
  import { onMount } from 'svelte';
  import { loading, error } from '../stores';
  import axios from 'axios';

  let products = [];
  let page = 1;

  onMount(async () => {
    loading.set(true);
    try {
      const res = await axios.get(`http://localhost:3001/products?page=${page}&size=10`, {
        headers: { 'x-api-key': '4eb07053-1eb8-4cd0-969a-c163456ff4c1' }
      });
      products = res.data.data;
    } catch (err) {
      error.set("Error loading products");
    } finally {
      loading.set(false);
    }
  });
</script>

 
{#if $loading}
  <p>Cargando...</p>
{:else if $error}
  <p>{$error}</p>
{:else}
  <ul>
    {#each products as product}
      <li>
        <a href={`/product/${product.id}`}>
          {product.attributes.name} - ${product.attributes.price}
        </a>

      </li>
    {/each}
  </ul>
{/if}
