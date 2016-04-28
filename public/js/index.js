(function(){
"use strict";

var HOST = "http://" + window.location.host;
var socket = io.connect(HOST);

function zfill(x, w) {
	var pad = "";
	for (var i = 0; i < w; i++) {
		pad += "0";
	}
	return (pad + x).slice(-w);
}

function noop(x){ return x; }
function getTime(date) {
	return date.split("T")[1].substr(0, 5);
}
function eventToRow(eve) {
	var $row = document.createElement("tr");
	["time", "class", "kind", "point"]
	.map(function(x){
		var $td = document.createElement("td");
		if (x == "time") {
			$td.textContent = getTime(eve[x]);
		}
		else {
			$td.textContent = eve[x];
		}
		return $td;
	})
	.forEach(function($x){
		$row.appendChild($x);
	})
	return $row;
}

function scoreToRow(score) {
	var $row = document.createElement("tr");

	if (typeof(scoreToRow.rank) === "undefined") {
		scoreToRow.rank = 1;
	}
	var $td_rank = document.createElement("td");
	$td_rank.textContent = scoreToRow.rank++;
	$row.appendChild($td_rank);

	[0, 1]
	.map(function (x) {
		var $td = document.createElement("td");
		$td.textContent = score[x];
		return $td;
	})
	.forEach(function($x) {
		$row.appendChild($x);
	})
	return $row;
}

function removeChildAll($node) {
	for (var i = $node.childNodes.length - 1; i >= 0; i--) {
		$node.removeChild($node.childNodes[i]);
	}
}

window.addEventListener("DOMContentLoaded", function(){
	var $eve = document.getElementById("event");
	var $score = document.getElementById("score");
	var events = [];

	function render() {
		removeChildAll($eve);
		events
		.map(eventToRow)
		.forEach(function($row){
			$eve.appendChild($row);
		})
		removeChildAll($score);
		var score = events.reduce(function(acc, x){
			acc[x.class] = (acc[x.class] || 0) + x.point;
			return acc;
		}, {});
		var ranking = Object.keys(score).map(function(x){
			return [score[x], x];
		}).sort().reverse();

		ranking
		.map(scoreToRow)
		.forEach(function ($row) {
			$score.appendChild($row);
		});
	}

	fetch("/event")
	.then(function (res) {
		return res.json();
	})
	.then(function(json){
		events = json["events"];
		render();
	})
	.then(function(){
		socket.on("event", function(msg){
			events.push(msg);
			render();
		});
	})
}, false);

})();