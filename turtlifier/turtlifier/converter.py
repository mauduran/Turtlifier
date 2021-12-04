import csv
from rdflib import Graph, Literal, RDF, URIRef, Namespace #basic RDF handling


class Converter:

    #Transform a string to upper camel case notation
    def to_upper_camel_case(text) -> str:
         # s = text.replace("-", " ").replace("_", " ")
        s = text.split()
        if len(text) == 0:
            return text
        return ''.join(i.capitalize() for i in s[0:])

    #Transform a string to lower camel case notation
    def to_lower_camel_case(text) -> str:
         # s = text.replace("-", " ").replace("_", " ")
        s = text.split()
        if len(text) == 0:
            return text
        return s[0] + ''.join(i.capitalize() for i in s[1:])

    #receives a string and returns it turtlified 
    def turtlify(file_text)-> str:
        
        #create graph to store the RDF triples
        g = Graph()
        
        #TODO use the prefixes that the user submitted, or use the default ones
        #prefixes to use
        data = Namespace('http://example.org/data/')
        predicate = Namespace('http://example.org/predicate/')


        #TODO use the separator that the user submitted, or use the default one
        #Parse the file_text to a csv dictionary
        csvreader = csv.DictReader(file_text,quotechar='"',delimiter=';')

        # if the first row contains header information, retrieve it like so
        headers = csvreader.fieldnames

        for row in csvreader:
            #row is an array of the columns in the file
            #Make sure to check the encoding of the strings in the array
            
            #The subject will always be the same for each turtle triple. We say that the <subject> <is a> <"whatever the header says">
            #According to the turtle rules, the subject - row[headers[0]] - needs to be in upper camel case. The object should be in upper camel case as well, but we are treating it as a Literal
            g.add((URIRef(data+Converter.to_upper_camel_case(row[headers[0]])), RDF.type, Literal(headers[0])))
           
            #add the rest of values for the turtle triple according to the available headers
            #Since the subject is still the same, we are only adding more predicates and objects to the turtle triple.
            #According to the turtle rules, the subject needs to be in upper camel case, and the predicate in lower camel case. We are still treating the object as a Literal, so none of the camelcases will apply
            for i in range(1,len(headers)):
                g.add((URIRef(data+Converter.to_upper_camel_case(row[headers[0]])), URIRef(predicate+Converter.to_lower_camel_case(headers[i])), Literal(row[headers[i]])))
        # print(g.serialize(format='turtle'))
        return g.serialize(format='turtle')





