/**
 * Created by Josh on 12/6/2014.
 */
window.onload = function()
{
    document.getElementById('tower0').onclick = select;
};

function select()
{
    document.getElementById('tower0').style.borderColor = 'white';
}