/**
 * Created by Josh on 12/6/2014.
 */
var towerSelected = false;
var curTower = null;
var curTowerBorder = '#000000';
var onTowers = false;

var money = 300;
var lives = 15;

/*
* Tower Description
*
* Radius is in pixels or vh
* upgrade_mult will determine cost of upgrade (factors in level)
* level is the upgrade level
*
* damage -- self explanatory
* speed is the rate of fire
*/

//Towers
var towers =
[
    tower0 = {cost:100, upgrade_mult:.6, level: 1, radius: 100, damage: 10, speed: 10},
    tower1 = {cost:150, upgrade_mult:.6, level: 1, radius: 300, damage: 20, speed: 7},
    tower2 = {cost:200, upgrade_mult:.6, level: 1, radius: 125, damage: 50, speed: 5},
    tower3 = {cost:250, upgrade_mult:.6, level: 1, radius: 200, damage: 25, speed: 10}
];

//Temporary enemies for testing
var enemies =
[
    enemy0 = {health: 50, speed: 5},
    enemy1 = {health: 50, speed: 5},
    enemy2 = {health: 50, speed: 5},
    enemy3 = {health: 50, speed: 5},
    enemy4 = {health: 0, speed: 5},
    enemy5 = {health: 50, speed: 5}
];

var invalidSpaces = []; //holds the ids of the elements that aren't valid tower areas
var prevElem = null;

window.onload = function()
{
    createGameBoard();
    createPath(1);
    document.getElementById('tower0').onclick = select;
    document.getElementById('tower1').onclick = select;
    document.getElementById('deselect').onclick = function(){deselect(curTower);};

    document.getElementById('start').onclick = start;
};

function start()
{
    var running = true;
    var enemy;

    for(var i = 0; i < enemies.length; i++)
    {
        enemy = createHTMLElement('div', 'e'+i, 'enemy', 'e');

    }

    while(running)
    {
        //Enemy AI
        checkEnemiesStatus();
        //Tower AI
        if(enemies.length === 0){runnning = false}
    }
}

function checkEnemiesStatus()
{
    for(var i = 0; i < enemies.length; i++)
    {
        if(enemies[i].health <= 0){enemies.splice(i); alert('Enemy Died ' + enemies);}
    }
}

function createGameBoard()
{
    var result = "";
    var element;
    var img;
    var row = 15;
    var col = 15;

    //Create Divs
    for(var i = 0; i < row; i++)
    {
        result += createHTMLElement('div', 'r'+i+'c'+0, 'tile clear', '');
        for(var j = 1; j < col; j++)
        {
            result += createHTMLElement('div', 'r' + i + 'c' + j, 'tile', '');
        }
    }

    //Add to board
    document.getElementById('board').innerHTML = result;

    //Add onclick and onmouseover
    for(i = 0; i < row; i++)
    {
        for(j = 0; j < col; j++)
        {
            img = document.createElement("IMG");
            img.src = "res/grass.png";
            img.id = "img"+i+"-"+j;

            element = document.getElementById('r'+i+'c'+j);
            element.appendChild(img);
            element.onclick = function() {if(towerSelected){checkTowerSelected(curTower.id.charAt(5), this);}};
            element.onmouseenter = function()
                                    {
                                        prevElem = this;
                                        validTile(prevElem);
                                    };
            element.onmouseleave = resetColor;
        }
    }

}

function createPath(pathNum)
{
    if(pathNum === 1){path1();}
    if(pathNum === 2){path2();}
}

function path1()
{
    var img;

    for(var i = 0; i < 15; i++)
    {
        img  = document.getElementById("img"+7+"-"+i);
        img.src = "res/road.png";

        document.getElementById('r'+7+'c'+i).style.backgroundColor = 'sandybrown';
        invalidSpaces.push('r'+7+'c'+i);
    }
    invalidSpaces.push('-');
}

function path2()
{
    //Part 1
    for(var i = 0; i < 4; i++)
    {
        //ri-c7
    }

    //Part 2
    for(var j = 0; j < 3; j++)
    {
        //ri-cj
    }

    //ri+1-cj-1
    //ri+2-cj-1

    i += 3;
    for(; j > 12; j--)
    {
        //ri-cj
    }

    //ri+1-cj+1
    //ri+2-cj+1

    i += 3;
    for(;j<7;j++)
    {
        //ri-cj
    }

    //Part 3
    for(;i < 15; i++)
    {
        //ri-cj
    }

}

function inInvalidSpaces(element)
{
    for(var i = 0; i < invalidSpaces.length; i++)
    {
        if(element.id == invalidSpaces[i]){return true;}
        if("-" == invalidSpaces[i]){onTowers = true;}
    }
    return false;
}

function getImgIdFromElementId(element)
{
    var id = element.id.substring(1);
    var cLoc = id.indexOf('c');

    id = "img" + id.substring(0,cLoc) + "-" + id.substring(cLoc+1);
    return id;
}

function validTile(element)
{
    var id = getImgIdFromElementId(element);

    //if its not road or has tower on it and a tower is selected return true
    if(towerSelected && !inInvalidSpaces(element))
    {
        document.getElementById(id).src = "res/grassX.png";
        return true;
    }
    else if(towerSelected)
    {
        document.getElementById(id).src = "res/roadX.png";
    }
    return false;
}

function checkTowerSelected(index, element)
{
    //if validTile and you can afford it place tower
    if(validTile(element) && money >= towers[index].cost)
    {
        //Change mouseover stuff
        element.onmouseenter = null;
        element.onmouseleave = null;
        element.onclick = null;//will be replased later

        //replace with tower
        img = document.getElementById(getImgIdFromElementId(prevElem)).src = "res/tower"+index+".png";
        invalidSpaces.push(element.id);

        //update money
        money -= towers[index].cost;
        document.getElementById('money').innerHTML = "Gold: " + money;

        //deselect tower
        deselect(curTower);
    }
}

function resetColor()
{
    var id = getImgIdFromElementId(prevElem);

    if(!inInvalidSpaces(prevElem)){ document.getElementById(id).src = "res/grass.png";}
    else{document.getElementById(id).src = "res/road.png";}
}

function select()
{
    if(curTower !== null){deselect(curTower);}
    curTower = this;
    curTowerBorder = curTower.style.backgroundColor;
    curTower.style.borderColor = 'white';
    towerSelected = true;
}

function deselect(tower)
{
    tower.style.borderColor = curTowerBorder;
    towerSelected = false;
    curTower = null;
}

//Creates element tags
function createHTMLElement(elementType, id, classInfo, content)
{

    //Sets all null values to 0 length strings
    if(elementType === null){elementType = "";}
    if(id === null){id = "";}
    if(classInfo === null){classInfo = "";}
    if(content === null){content = "";}

    //Trims all spaces preceding and succeeding the parameters
    //excluding the content.
    elementType = elementType.trim();
    id = id.trim();
    classInfo = classInfo.trim();

    //If str length is not 0 it adds class=" or id=" plus "
    if(id.length > 0){id = ' id="' + id + '"';}
    if(classInfo.length > 0){classInfo = ' class="' + classInfo + '"';}

    return '<'	+ elementType +
        id 	+ classInfo	  +
        '>'	+ content	  +
        '</' + elementType + '>';
}