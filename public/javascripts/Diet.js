const colors=['black', 'orange', 'yellow', 'green', 'blue', 'indigo', 'green','whitesmoke', 'orange', 'yellow', 'green', 'blue'];

const a=document.getElementsByTagName('span')
for(let i=0;i<colors.length;i++)
{
   a[i].style.color=colors[i];
}

const h1=document.querySelector('h1')
h1.classList.remove('border');

const findMore=document.querySelector("#findMore")
findMore.addEventListener('click', ()=>
{
   alert('Hello, please scroll down for more information about healthy diet');
})