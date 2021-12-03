import csv
from rdflib import Graph, Literal, RDF, URIRef, Namespace #basic RDF handling


class Converter:

    #Transform a string to camel case notation
    def to_camel_case(text) -> str:
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

        #Convert the headers to camelcase to avoid formating errors further down the line
        for i in range(len(headers)):
            headers[i] = Converter.to_camel_case(headers[i])

        for row in csvreader:
            #row is an array of the columns in the file
            #Make sure to check the encoding of the strings in the array
            
            #The subject will always be the same for each turtle attribute
            g.add((URIRef(data+row[headers[0]]), RDF.type, Literal(headers[0])))
           
            #add the rest of the turtle triples according to the available headers
            for i in range(1,len(headers)):
                g.add((URIRef(data+row[headers[0]]), URIRef(predicate+headers[i]), Literal(row[headers[i]])))

        return g.serialize(format='turtle')





