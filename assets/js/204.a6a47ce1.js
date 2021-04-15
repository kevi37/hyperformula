(window.webpackJsonp=window.webpackJsonp||[]).push([[204],{666:function(t,e,a){"use strict";a.r(e);var l=a(45),i=Object(l.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"types-of-values"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#types-of-values"}},[t._v("#")]),t._v(" Types of values")]),t._v(" "),a("p",[t._v("Values in HyperFormula can refer to Numbers, Text, Logical, Date, Time,\nDateTime, Error, or Duration data.  The type of the value depends on\nthe data to which it's referring. Functions may work differently based\non the types of values.")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("Type of value")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("Description")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Number")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("A numeric value such as 0, 2, -40, 0.1, and also scientific notation e.g. 5.6E+01; with a period as a default decimal separator.")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Text (string)")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v('A text value, like "ABC", "apollo".')])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Logical (Distinct Boolean)")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("A logical value might be one of two values: TRUE or FALSE. Please note that even if there is type coercion this will be recognized as TRUE/FALSE when comparing to numbers. It will not be recognized as 1 or 0.")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Date")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("A Gregorian calendar date in DD/MM/YYYYY (default format), like 22/06/2022. All dates from 30/12/1899 to 31/12/9999 are supported.")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Time")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("A time in hh:mm:ss or hh:mm (default format), like 10:40:16.")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("DateTime")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Date and Time types combined into one, like 22/06/2022 10:40:16.")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Error")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("An error returned as a result of formula calculation, like #REF!")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Duration")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("A time-based amount of time")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Currency")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Number representing currency")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Percentage")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Number representing percentage")])])])]),t._v(" "),a("h2",{attrs:{id:"getting-cell-type"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#getting-cell-type"}},[t._v("#")]),t._v(" Getting cell type")]),t._v(" "),a("p",[t._v("Cells have types that can be retrieved by using the "),a("code",[t._v("getCellType")]),t._v("\nmethod. Cell content is not calculated and the method returns only\nthe type, so, for example, you can check if there is a formula inside\na cell. Here is the list of possible cell types: "),a("code",[t._v("'FORMULA'")]),t._v(", "),a("code",[t._v("'VALUE'")]),t._v(",\n"),a("code",[t._v("'MATRIX'")]),t._v(", "),a("code",[t._v("'EMPTY")]),t._v(".")]),t._v(" "),a("h2",{attrs:{id:"getting-cell-value-type"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#getting-cell-value-type"}},[t._v("#")]),t._v(" Getting cell value type")]),t._v(" "),a("p",[t._v("You can also use the "),a("code",[t._v("getCellValueType")]),t._v(" method which returns\nthe calculated value type, so a cell's value for the formula:\n"),a("code",[t._v("'=SUM(1,2,3)'")]),t._v(" will be 'NUMBER'. Here is the list of possible cell value\ntypes: "),a("code",[t._v("'NUMBER'")]),t._v(", "),a("code",[t._v("'STRING'")]),t._v(", "),a("code",[t._v("'BOOLEAN'")]),t._v(", "),a("code",[t._v("'ERROR'")]),t._v(", "),a("code",[t._v("'EMPTY'")]),t._v(".")]),t._v(" "),a("h2",{attrs:{id:"getting-detailed-cell-value-type"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#getting-detailed-cell-value-type"}},[t._v("#")]),t._v(" Getting detailed cell value type")]),t._v(" "),a("p",[t._v("Currently, number type contains several subtypes (date, time, datetime, currency, percentage),\nthat can be used interchangeably with numbers in computation. We keep track of those, so eg if\na function produces currency-type output, and later the value is used in arithmetic operations,\nthe output of those is as well-marked as currency-type. Info about those can be extracted via "),a("code",[t._v("getCellValueDetailedType")]),t._v(" function.\nAuxiliary information about formatting (if there is any) is available via "),a("code",[t._v("getCellValueFormat")]),t._v(" function. In case of currency, it would be\nthe currency symbol used when parsing the currency (e.g. '$').")])])}),[],!1,null,null,null);e.default=i.exports}}]);