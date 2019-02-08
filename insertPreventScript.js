let fs = require('fs');

let scriptToInsert = `
<script type="text/javascript">
  window.onload = function() {
    let baseHref = document.getElementsByTagName('base')[0].attributes[0].value;
    document.getElementsByTagName('base')[0].attributes[0].value = window.location.pathname.split(baseHref)[0] + baseHref;

    let linkCss = CSSTAG;
    let scriptsSrc = SCRIPTTAG;

    appendCss();
    appendScript();

    function appendCss() {
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = linkCss;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    function appendScript() {
      let script = document.createElement('script');

      script.src = scriptsSrc.shift();
      script.type = 'text/javascript';
      script.onload = function() {
        if (scriptsSrc.length) {
          appendScript();
        }
      };

      document.getElementsByTagName('body')[0].appendChild(script);
    }
  };
</script>
`;

fs.readFile(__dirname + '/../dist/index.html', 'utf-8', function(err, buf) {
  // Regex to get contents of script tags
  let regexScript = new RegExp(/<script type="text\/javascript" src\=\"(.*?)\">/, 'g');
  let regexLinkCss = new RegExp(/<link rel="stylesheet".* href\=\"(.*?)\"/, 'g');

  let arr = [];
  let linkHref = regexLinkCss.exec(buf)[1];

  let src;
  while ((src = regexScript.exec(buf))) {
    arr.push(src[1]);
  }

  // Delete all scripts tags
  buf = buf.replace(/<script.*>.*<\/script>/ims, ' ');

  // Delete all links tags
  buf = buf.replace(/<link rel="stylesheet" href=".*">/ims, ' ');

  // Replace the SCRIPTTAG and CSSTAG by values
  scriptToInsert = scriptToInsert.split('SCRIPTTAG').join('["' + arr.join('","') + '"]');
  scriptToInsert = scriptToInsert.split('CSSTAG').join('"' + linkHref + '"');

  // Insert the script into the <head></head>
  buf = buf.split('</head>').join(scriptToInsert + '</head>');

  // Delete index and recreate it
  fs.unlink(__dirname + '/../dist/index.html', err => {
    if (err) throw err;
    fs.writeFile(__dirname + '/../dist/index.html', buf, function(err, data) {
      if (err) console.log(err);
      console.log('Successfully Written to File.');
    });
  });
});
