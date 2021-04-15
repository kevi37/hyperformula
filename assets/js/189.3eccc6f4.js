(window.webpackJsonp=window.webpackJsonp||[]).push([[189],{651:function(e,n,t){"use strict";t.r(n);var o=t(45),r=Object(o.a)({},(function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"known-limitations"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#known-limitations"}},[e._v("#")]),e._v(" Known limitations")]),e._v(" "),t("p",[e._v("Here are the shortcomings of HyperFormula in its current development\nstage:")]),e._v(" "),t("ul",[t("li",[e._v("Node.js versions older than 13 don't properly compare\nculture-insensitive strings. HyperFormula requires the full\nInternational Components for Unicode (ICU) to be supported.\n"),t("a",{attrs:{href:"https://nodejs.org/api/intl.html#intl_embed_the_entire_icu_full_icu",target:"_blank",rel:"noopener noreferrer"}},[e._v("Learn more"),t("OutboundLink")],1)]),e._v(" "),t("li",[e._v("GPU acceleration is used only by matrix functions: MMULT, MEDIANPOOL, MAXPOOL.")]),e._v(" "),t("li",[e._v("GPU.js works only in browsers that support ES6. "),t("RouterLink",{attrs:{to:"/guide/enabling-gpu-acceleration.html"}},[e._v("Learn more")])],1),e._v(" "),t("li",[e._v("Multiple workbooks are not supported. One instance of HyperFormula\ncan handle only one workbook with multiple worksheets at a time.")]),e._v(" "),t("li",[e._v('For cycle detection, all possible dependencies between cells are\ntaken into account, even if some of them could be omitted after\nthe full evaluation of expressions and condition statements. The\nmost prominent example of this behavior is the "IF" function which\nreturns a cycle error regardless of whether TRUE or FALSE causes\na circular reference.')]),e._v(" "),t("li",[e._v("There is no data validation against named ranges. For example,\nyou can't compare the arguments in a formula like this:\n=IF(firstRange>secondRange; TRUE; FALSE).")]),e._v(" "),t("li",[e._v("There is no relative referencing in named ranges.")]),e._v(" "),t("li",[e._v("The library doesn't offer (at least not yet) the following features:\n"),t("ul",[t("li",[e._v("3D references")]),e._v(" "),t("li",[e._v("Constant arrays")]),e._v(" "),t("li",[e._v("Dynamic arrays")]),e._v(" "),t("li",[e._v("Asynchronous functions")]),e._v(" "),t("li",[e._v('Structured references ("Tables")')]),e._v(" "),t("li",[e._v("Relative named expressions")]),e._v(" "),t("li",[e._v("Functions cannot use UI metadata (e.g. hidden rows for SUBTOTAL).")])])])]),e._v(" "),t("h2",{attrs:{id:"nuances-of-the-implemented-functions"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#nuances-of-the-implemented-functions"}},[e._v("#")]),e._v(" Nuances of the implemented functions")]),e._v(" "),t("ul",[t("li",[e._v("We immediately instantiate references to single cells to their values instead of treating them as 1-length ranges, which slightly changes behavior of some functions (e.g. NPV).")]),e._v(" "),t("li",[e._v("SUBTOTAL function does not ignore nested subtotals.")]),e._v(" "),t("li",[e._v("CHISQ.INV, CHISQ.INV.RT, CHISQ.DIST.RT, CHIDIST, CHIINV and CHISQ.DIST (CHISQ.DIST in CDF mode): Running time grows linearly with the value of the second parameter, degrees_of_freedom (slow for values>1e7).")]),e._v(" "),t("li",[e._v("GAMMA.DIST, GAMMA.INV, GAMMADIST, GAMMAINV (GAMMA.DIST and GAMMADIST in CDF mode): Running time grows linearly with the value of the second parameter, alpha (slow for values>1e7).")])])])}),[],!1,null,null,null);n.default=r.exports}}]);