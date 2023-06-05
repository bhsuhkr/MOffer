<template>
  <Transactions
    :fields="fields"
    :transactionData="transactionData"
  ></Transactions>
</template>

<script>
import Transactions from "./components/Transactions.vue";

export default {
  name: "App",
  components: {
    Transactions,
  },
  setup() {
    // sample data
    const transactionData = [
      {
        ID: "01",
        Name: "Abiola Esther",
        Balance: "17",
      },
      {
        ID: "02",
        Name: "Robert V. Kratz",
        Balance: "19",
      },
      {
        ID: "03",
        Name: "Kristen Anderson",
        Balance: "20",
      },
      {
        ID: "04",
        Name: "Adam Simon",
        Balance: "21",
      },
      {
        ID: "05",
        Name: "Daisy Katherine",
        Balance: "22",
      },
    ];
    const fields = ["ID", "Name", "Balance"];

    return { transactionData, fields };
  },
};
</script>

<style scoped></style>
