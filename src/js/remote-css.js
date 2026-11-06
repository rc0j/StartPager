// Third-party stylesheets. Inserted from script rather than with @import or a
// <link> in the HTML so they can't block first paint: parser-inserted
// stylesheets keep the whole new tab blank until the CDN answers.
for (const href of [
  "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css",
]) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
