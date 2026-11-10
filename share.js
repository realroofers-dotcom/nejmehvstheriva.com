/* BUILT 2026-11-09 · share-1a. Mark: "can we get share buttons on the audio files on nejmehvstheriva.com".
   Draws a row of share buttons into every <div class="shareRow" data-url="..." data-text="...">.
   Phone: the phone's own Share sheet (any app). Everywhere: X, Facebook, Email, Copy link.
   Shares a link to the page only; nothing is sent to us and nothing is tracked. */
(function(){
  var ICON={
    share:'<path d="M12 3v12 M7 8l5-5 5 5 M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    x:'<path d="M4 4l16 16 M20 4L4 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    fb:'<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" fill="currentColor"/>',
    mail:'<path d="M3 6h18v12H3z M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    save:'<path d="M12 3v12 M7 10l5 5 5-5 M5 19h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  /* share-1b 2026-11-09 (Mark: "create shares for the graphics"): a row with data-img shares the PICTURE itself on a phone
     (the phone's own Share sheet, when it can take files) and adds a Save image button. */
  function imgFile(src){
    return fetch(src).then(function(r){return r.blob();}).then(function(b){
      var name=src.split('/').pop(); return new File([b],name,{type:b.type||'image/jpeg'});});
  }
  function btn(icon,label,href){
    var el=document.createElement(href?'a':'button');
    if(href){el.href=href;el.target='_blank';el.rel='noopener';}else{el.type='button';}
    el.setAttribute('aria-label',label);
    el.style.cssText='display:inline-flex;align-items:center;gap:5px;font:600 12px/1 -apple-system,Segoe UI,Arial,sans-serif;color:#1f4e79;background:#fff;border:1px solid #9db7d3;border-radius:999px;padding:5px 10px;margin:0 6px 6px 0;cursor:pointer;text-decoration:none';
    el.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">'+ICON[icon]+'</svg><span>'+label+'</span>';
    return el;
  }
  function build(row){
    var url=row.getAttribute('data-url')||location.href, text=row.getAttribute('data-text')||document.title;
    var u=encodeURIComponent(url), t=encodeURIComponent(text);
    row.style.cssText+='display:flex;flex-wrap:wrap;align-items:center;margin:6px 0 0';
    var img=row.getAttribute('data-img');
    if(navigator.share){
      var s=btn('share','Share');
      s.addEventListener('click',function(){
        if(img && navigator.canShare){
          imgFile(img).then(function(f){
            if(navigator.canShare({files:[f]})){return navigator.share({files:[f],title:text,text:text+' '+url});}
            return navigator.share({title:text,text:text,url:url});
          }).catch(function(){});
        } else { navigator.share({title:text,text:text,url:url}).catch(function(){}); }
      });
      row.appendChild(s);
    }
    row.appendChild(btn('x','X','https://twitter.com/intent/tweet?text='+t+'&url='+u));
    row.appendChild(btn('fb','Facebook','https://www.facebook.com/sharer/sharer.php?u='+u));
    row.appendChild(btn('mail','Email','mailto:?subject='+t+'&body='+t+'%0A%0A'+u));
    var c=btn('link','Copy link');
    c.addEventListener('click',function(){
      var done=function(){var l=c.querySelector('span');l.textContent='Copied';setTimeout(function(){l.textContent='Copy link';},2000);};
      if(navigator.clipboard){navigator.clipboard.writeText(url).then(done).catch(function(){prompt('Copy this link:',url);});}
      else{prompt('Copy this link:',url);}
    });
    row.appendChild(c);
    if(img){
      var sv=btn('save','Save image',img); sv.removeAttribute('target'); sv.setAttribute('download',img.split('/').pop());
      row.appendChild(sv);
    }
  }
  function go(){document.querySelectorAll('.shareRow').forEach(build);}
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',go);}else{go();}
})();
