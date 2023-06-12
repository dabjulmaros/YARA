<script>
  export let noMargin;
  export const submitSearch = (method) => formSubmit(method);

  export let inputField;
  function formSubmit(method = 0) {
    if (inputField != "") {
      if (window.location.pathname.includes("/scrape/") || method == 2)
        window.location = `/scrape/${inputField}`;
      else window.location = `/r/${inputField}`;
    } else {
      document.querySelector("input").setAttribute("aria-invalid", "true");
      document.querySelector("input").placeholder = "Please Enter a Sub name";
      setTimeout(() => {
        document.querySelector("input").setAttribute("aria-invalid", "false");
        document.querySelector("input").placeholder =
          "Enter Sub name... no r/ needed";
      }, 1000);
    }
  }

  function keyDown(e) {
    if (e.keyCode == 13) {
      formSubmit();
    }
  }
</script>

<input
  type="search"
  placeholder="Enter Sub name... no r/ needed"
  bind:value={inputField}
  on:keydown={keyDown}
  style={`max-width:600px;${noMargin ? "margin:0" : ""}`}
/>
