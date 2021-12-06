############################################
############################################
###     Date: December 7, 2021           ###
###     @author Mauricio Duran Padilla   ###
###     @author Juan Pablo Ramos Robles  ###
###     @author Alfonso Ramírez Casto    ###
############################################
############################################

import csv
from rdflib import Graph, Literal, URIRef, Namespace  # basic RDF handling
    
class Converter:
    @staticmethod
    # Transform a string to upper camel case notation
    def to_upper_camel_case(text) -> str:
        s = text.split()
        if len(text) == 0:
            return text
        return ''.join(i.capitalize() for i in s[0:])

    @staticmethod
    # Transform a string to lower camel case notation
    def to_lower_camel_case(text) -> str:
        s = text.split()
        if len(text) == 0:
            return text
        return s[0] + ''.join(i.capitalize() for i in s[1:])
    
    # Function to generate title line if it is not included in the csv
    # Predicates will be generated in the form of "predicate0"
    @staticmethod
    def generate_title_line(line: str, separator: str  = ",") -> str:
        size = len(line.split(separator))
        return separator.join([f"predicate{i}" for i in range(0, size)])

    # receives a string and returns it turtlified
    def turtlify(
        file_text, 
        separator=",", 
        dataPrefix=("data",'http://example.org/data/'), #Prefix name and uri come as a tuple
        predPrefix=("pred",'http://example.org/predicate/'), #Prefix name and uri come as a tuple
        ) -> str:

        # create graph to store the RDF triples
        g = Graph()

        # prefixes to use
        dataPrefNs = Namespace(dataPrefix[1])
        predicatePrefNs = Namespace(predPrefix[1])
        
        # Binding Prefixes
        g.bind(dataPrefix[0], dataPrefNs)
        g.bind(predPrefix[0], predicatePrefNs)


        csvreader = csv.DictReader(
            file_text, quotechar='"', delimiter=separator)

        # if the first row contains header information, retrieve it like so
        headers = csvreader.fieldnames
        

        # row is an array of the columns in the file, idx refers to the line number
        for (idx, row) in enumerate(csvreader):
            # Make sure to check the encoding of the strings in the array

            # Take index or line number as the definition of the URI and main subject
            # Proceed to add  predicates and objects to the turtle triple.
            # According to the turtle rules, the subject needs to be in upper camel case, and the predicate in lower camel case. We are still treating the object as a Literal, so none of the camelcases will apply
            for i in range(0, len(headers)):
                subj = dataPrefNs["Subj" + str(idx)]
                
                if(row[headers[i]]):
                    g.add((
                        URIRef(subj), 
                        URIRef(predicatePrefNs[Converter.to_lower_camel_case(headers[i])]),
                        Literal(row[headers[i]])
                    ))
        return g.serialize(format='turtle')
