<script lang="ts">
  import { onMount } from 'svelte';
  import { loading, error } from '../stores';
  import axios from 'axios';
  export let productId;

  let quantity = 0;

  async function getQuantity() {
    loading.set(true);
    try {
      const res = await axios.get(`http://localhost:3002/inventory/${productId}`, {
        headers: { 'x-api-key': '4eb07053-1eb8-4cd0-969a-c163456ff4c1' }
      });
      quantity = res.data.data.attributes.quantity;
    } catch (err) {
      error.set("Error actualizando la cantidad");
    } finally {
      loading.set(false);
    }
  }

  async function buy() {
    loading.set(true);
    try {
      const res = await axios.patch(`http://localhost:3002/inventory/${productId}`, { quantity: quantity - 1 }, {
        headers: { 'x-api-key': '4eb07053-1eb8-4cd0-969a-c163456ff4c1' }
      });
      quantity = res.data.data.attributes.quantity;
    } catch (err) {
      error.set("Error actualizando el inventario");
    } finally {
      loading.set(false);
    }
  }

  onMount(getQuantity);
</script>

{#if $loading}
  <p>Cargando...</p>
{:else if $error}
  <p>{$error}</p>
{:else}
  <p>Cantidad disponible: {quantity}</p>
  <button on:click={buy}>Comprar</button>
{/if}
