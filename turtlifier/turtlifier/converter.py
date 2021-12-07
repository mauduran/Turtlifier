############################################
############################################
###     Date: December 7, 2021           ###
###     @author Mauricio Duran Padilla   ###
###     @author Juan Pablo Ramos Robles  ###
###     @author Alfonso Ramírez Casto    ###
############################################
############################################

import csv
import typing
from rdflib import Graph, Literal, URIRef, Namespace  # basic RDF handling


class Converter:
    @staticmethod
    def to_upper_camel_case(text) -> str:
        """Transform a string to pascal case notation."""
        s = text.split()
        if len(text) == 0:
            return text
        return ''.join(i.capitalize() for i in s[0:])

    @staticmethod
    def to_lower_camel_case(text) -> str:
        """Transform a string to camel case notation."""
        s = text.split()
        if len(text) == 0:
            return text
        return s[0].lower() + ''.join(i.capitalize() for i in s[1:])

    @staticmethod
    def generate_title_line(line: str, separator: str = ",") -> str:
        """
        Function to generate title line if it is not included in the csv
        Predicates will be generated in the form of 'predicate0'
        """
        size = len(line.split(separator))
        return separator.join([f"predicate{i}" for i in range(0, size)])

    @staticmethod
    def turtlify(
        file_text: list,
        separator: str = ",",
        # Prefix name and uri come as a tuple
        dataPrefix: tuple = ("data", 'http://example.org/data/'),
        # Prefix name and uri come as a tuple
        predPrefix: tuple = ("pred", 'http://example.org/predicate/'),
    ) -> str:
        """
        Function that receives the csv file content with some parameters
        and generates a turtl files with the RDF triples.
        """
        # create graph to store the RDF triples
        g = Graph()

        # prefixes to use
        dataPrefNs = Namespace(dataPrefix[1])
        predicatePrefNs = Namespace(predPrefix[1])

        # Binding Prefixes
        g.bind(dataPrefix[0], dataPrefNs)
        g.bind(predPrefix[0], predicatePrefNs)

        # Define how file_text is going to be parsed
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
                        URIRef(
                            predicatePrefNs + Converter.to_lower_camel_case(headers[i])),
                        Literal(row[headers[i]])
                    ))
        # Stringify the graph to write it later on
        return g.serialize(format='turtle')

    @staticmethod
    def read_csv_and_setup(
        file_string: str,
        separator: str = ",",
        has_titles: bool = True,
        title_line_num: int = 1,
        data_line_num: int = 2,
        last_line_to_process: int = -1
    ):
        # Array of lines of the text excluding empty lines
        file_text = []

        # Parse csv
        # read data line by line
        for (index, line) in enumerate(file_string.splitlines()):
            line_number = index + 1

            line = str(line, 'utf-8')

            # Stop reading file if we have reached last line to process
            if(last_line_to_process > 0 and index == last_line_to_process):
                break

            # Ignore all lines that come before the title line number
            if(has_titles and line_number < title_line_num):
                continue

            is_title_line = has_titles and line_number == title_line_num

            # Ignore all lines that come before data_line_num except title line
            if ((not is_title_line or not has_titles) and line_number < data_line_num):
                continue

            # Ignore empty lines
            if(line.strip() == ""):
                continue
            file_text.append(line)

        # If csv does not include titles, generate them and add them to file_text
        if(not has_titles and len(file_text[0]) > 0):
            titles = Converter.generate_title_line(file_text[0], separator)
            file_text.insert(0, titles)

        return file_text
