(function() {
  window["Endpoint"] = {

    "query": function(query, continuation) {
      $.getJSON(endpoint, {"query":query,"output":"json"}, continuation);
    },

    "getPeople": function(continuation) {
      var query = "";
      query += "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n";
      query += "PREFIX gene: <http://www.evanpatton.com/family/schema.ttl#>\n";
      query += "PREFIX bio: <http://purl.org/vocab/bio/0.1/>\n";
      query += "PREFIX dc: <http://purl.org/dc/terms/>\n";
      query += "PREFIX dbpedia: <http://dbpedia.org/ontology/>\n";
      query += "SELECT ?uri ?first ?middle ?maiden ?last ?birth ?birthLoc ?death ?deathLoc ?deathCause ?deathComment ?mother ?father ";
      if(graph != null) {
	query += "FROM <"+graph+"> ";
      }
      query += "WHERE {\n";
      query += "?uri a foaf:Person ; foaf:givenName ?first ; foaf:familyName ?last .\n";
      query += "OPTIONAL { ?uri gene:middleName ?middle }\n";
      query += "OPTIONAL { ?uri gene:maidenName ?maiden }\n";
      query += "OPTIONAL { ?uri bio:birth ?birthBN .\n";
      query += "OPTIONAL { ?birthBN dc:date ?birth }\n";
      query += "OPTIONAL { ?birthBN bio:place ?birthLoc }\n";
      query += "}\n";
      query += "OPTIONAL { ?uri bio:death ?deathBN .\n";
      query += "OPTIONAL { ?deathBN dc:date ?death }\n";
      query += "OPTIONAL { ?deathBN bio:place ?deathLoc }\n";
      query += "OPTIONAL { ?deathBN rdfs:comment ?deathComment }\n";
      query += "}\n";
      query += "OPTIONAL { ?uri dbpedia:deathCause ?deathCause }\n";
      query += "OPTIONAL { ?uri bio:mother ?mother }\n";
      query += "OPTIONAL { ?uri bio:father ?father }\n";
      query += "}";
      Endpoint.query(query, continuation);
    },

    "getMarriages": function(continuation) {
      var query = "";
      query += "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n";
      query += "PREFIX bio: <http://purl.org/vocab/bio/0.1/>\n";
      query += "PREFIX dc: <http://purl.org/dc/terms/>\n";
      query += "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n";
      query += "SELECT ?spouse1 ?spouse2 ?marryDate ?divorceDate ?loc ";
      if(graph != null) {
	query += "FROM <"+graph+"> ";
      }
      query += "WHERE {\n";
      query += "?bn a bio:Marriage ; bio:partner ?spouse1 , ?spouse2 .\n";
      query += "FILTER(?spouse1 != ?spouse2 && xsd:string(?spouse1) < xsd:string(?spouse2))\n";
      query += "OPTIONAL { ?bn dc:date ?marriageDate }\n";
      query += "OPTIONAL { ?bn bio:place ?loc }\n";
      query += "OPTIONAL { [ a bio:Divorce ; bio:partner ?spouse1 , ?spouse2 ; dc:date ?divorceDate ] }\n";
      query += "}";
      Endpoint.query(query, continuation);
    },

    "getOccupations": function(continuation) {
      var query = "";
      query += "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n";
      query += "PREFIX dbpedia: <http://dbpedia.org/ontology/>\n";
      query += "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n";
      query += "PREFIX bio: <http://purl.org/vocab/bio/0.1/>\n";
      query += "SELECT ?uri ?occupationUri ?label ?comment ?loc ";
      if(graph != null) {
	query += "FROM <"+graph+"> ";
      }
      query += "WHERE {\n";
      query += "?uri a foaf:Person ; dbpedia:occupation ?bn .\n";
      query += "?bn a ?occupationUri .\n";
      query += "OPTIONAL { ?occupationUri rdfs:label ?label }\n";
      query += "OPTIONAL { ?bn rdfs:comment ?comment }\n";
      query += "OPTIONAL { ?bn bio:place ?loc }\n";
      query += "}";
      Endpoint.query(query, continuation);
    },

    "getImages": function(continuation) {
      var query = "";
      query += "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n";
      query += "PREFIX dc: <http://purl.org/dc/terms/>\n";
      query += "SELECT ?uri ?img ?date ";
      if(graph != null) {
	query += "FROM <"+graph+"> ";
      }
      query += "WHERE {\n";
      query += "?uri a foaf:Person ; foaf:depiction ?img .\n";
      query += "OPTIONAL { ?img dc:date ?date }\n";
      query += "} ORDER BY ?date";
      Endpoint.query(query, continuation);
    },

    "getLocations": function(continuation) {
      var query = "";
      query += "PREFIX dbpedia: <http://dbpedia.org/ontology/>\n";
      query += "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n";
      query += "PREFIX v: <http://www.w3.org/2006/vcard/ns#>\n";
      query += "PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>\n";
      query += "SELECT ?uri ?label ?lat ?lng ?addrSt ?addrTown ?addrState ?addrZip ";
      if(graph != null) {
	query += "FROM <"+graph+"> ";
      }
      query += "WHERE {\n";
      query += "?uri a dbpedia:place .\n";
      query += "OPTIONAL { ?uri rdfs:label ?label }\n";
      query += "OPTIONAL { ?uri wgs:lat ?lat ; wgs:long ?lng }\n";
      query += "OPTIONAL { ?uri v:adr [ v:street-address ?addrSt ] }\n";
      query += "OPTIONAL { ?uri v:adr [ v:locality ?addrTown ] }\n";
      query += "OPTIONAL { ?uri v:adr [ v:region ?addrState ] }\n";
      query += "OPTIONAL { ?uri v:adr [ v:postal-code ?addrZip ] }\n";
      query += "}";
      Endpoint.query(query, continuation);
    },

    "getResidences": function(continuation) {
      var query = "";
      query += "PREFIX dbpedia: <http://dbpedia.org/ontology/>\n";
      query += "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n";
      query += "SELECT ?uri ?loc ";
      if(graph != null) {
	query += "FROM <"+graph+"> ";
      }
      query += "WHERE {\n";
      query += "?uri a foaf:Person ; dbpedia:residence ?loc\n";
      query += "}";
      Endpoint.query(query, continuation);
    },

    "getAdoptions": function(continuation) {
      var query = "";
      query += "PREFIX bio: <http://purl.org/vocab/bio/0.1/>\n";
      query += "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n";
      query += "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n";
      query += "SELECT ?uri ?date ?parent1 ?parent2 ";
      if(graph != null) {
	query += "FROM <"+graph+"> ";
      }
      query += "WHERE {\n";
      query += "?uri a foaf:Person ; bio:event ?bn .\n";
      query += "?bn a bio:Adoption .\n";
      query += "OPTIONAL { ?bn bio:parent ?parent1, ?parent2 \n";
      query += "FILTER(?parent1 != ?parent2 && xsd:string(?parent1) < xsd:string(?parent2))\n";
      query += "}\n";
      query += "}";
      Endpoint.query(query, continuation);
    },

    "getDeathCauses": function(continuation) {
      var query = "";
      query += "PREFIX dbpedia: <http://dbpedia.org/ontology/>\n";
      query += "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n";
      query += "SELECT DISTINCT ?uri ?label ";
      if(graph != null) {
	query += "FROM <"+graph+"> ";
      }
      query += "WHERE {\n";
      query += "[] dbpedia:deathCause ?uri .\n";
      query += "OPTIONAL { ?uri rdfs:label ?label }\n";
      query += "}";
      Endpoint.query(query, continuation);
    }

  };
})();
