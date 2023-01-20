<script lang="ts">
  import { enhance, type SubmitFunction } from "$app/forms";
  import type { ActionData } from "./$types";
  import toast from "svelte-french-toast";

  export let form: ActionData;

  const formSubmission: SubmitFunction = ({ form, data, action, cancel }) => {
    const { amount } = Object.fromEntries(data);
    if (isNaN(Number(amount))) {
      toast.error("Amount must be a number", {
        position: "bottom-right",
      });
      cancel();
    }

    return async ({ result, update }) => {
      switch (result.type) {
        case "success":
          toast.success("Expense submitted", {
            position: "bottom-right",
          });
          await update();
          break;
        default:
          toast.error("Something went wrong");
          break;
      }
    };
  };
</script>

<div class="p-4">
  <h1 class="text-4xl font-bold text-center">Expense Reporter</h1>
  <div class="pt-4">
    <form method="POST" use:enhance={formSubmission}>
      <div class="flex flex-col gap-4 max-w-[300px] mx-auto">
        <div class="form-control w-full max-w-xs self-center">
          <label for="expense" class="label">
            <span class="label-text">Expense <span class="text-red-600 font-bold">*</span></span>
          </label>
          <input
            name="expense"
            type="text"
            placeholder="Type here"
            class="input input-bordered w-full max-w-xs"
            required
          />
        </div>
        <div class="form-control w-full max-w-xs self-center">
          <label for="amount" class="label">
            <span class="label-text">Amount <span class="text-red-600 font-bold">*</span></span>
          </label>
          <input
            name="amount"
            type="text"
            placeholder="Type here"
            class="input input-bordered w-full max-w-xs"
            required
          />
        </div>
        <div class="form-control w-full max-w-xs self-center">
          <label for="category" class="label">
            <span class="label-text">Category <span class="text-red-600 font-bold">*</span></span>
          </label>
          <select name="category" class="select select-bordered" required>
            <option disabled selected hidden>Pick one</option>
            <option>Coffee</option>
            <option>Eating Out</option>
            <option>Flights</option>
            <option>Gas</option>
            <option>Groceries</option>
            <option>Hotels</option>
            <option>Transportation</option>
            <option>Utilities</option>
            <option>Misc</option>
          </select>
        </div>
        <div class="w-auto">
          <button class="btn btn-success btn-md">Submit</button>
        </div>
      </div>
    </form>
  </div>
</div>
