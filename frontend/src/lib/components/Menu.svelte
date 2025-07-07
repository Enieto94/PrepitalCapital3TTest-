<script>
  import { goto } from '$app/navigation';

  function viewProducts() {
    goto(`/product`);
  }

</script>




<button on:click={() => viewProducts()}>Ver Lista de Productos</button>
