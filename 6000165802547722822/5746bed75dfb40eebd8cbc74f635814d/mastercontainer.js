
    const containerList = ["496ce8f65af94180b1b148723ff3e9c5","f6dabbfd13d44767b34cf35f155b5e34"];
    var d = document,
    s = d.getElementsByTagName('script')[0];
    containerList.forEach(container => {
      fetch(`https://raw.githubusercontent.com/sachin-sinha/cdn/master/6000165802547722822/5746bed75dfb40eebd8cbc74f635814d/${container}.js`)
      .then(response => response.text())
      .then(scriptText => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.text = scriptText;
        s.parentNode.insertBefore(script, s);
      });
    })
  