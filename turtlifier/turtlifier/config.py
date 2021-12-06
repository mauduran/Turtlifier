###############################################
###############################################
###     Date: December 7, 2021              ###
###     @author Mauricio Duran Padilla      ###
###     @author Juan Pablo Ramos Robles     ###
###     @author Alfonso Ramírez Casto       ###
###############################################
###############################################

import configparser

class Config:
    CONFIG_FILE = "config.ini"

    @staticmethod
    def get_config() -> dict:
        ini_conf = configparser.ConfigParser()
        ini_conf.read(Config.CONFIG_FILE)
        config_section = ini_conf["DEFAULT"]

        # Create dictionary and populate it with the configuration from config.ini file
        default_config = {}
        default_config["separator"] = config_section["separator"]
        default_config["hasTitles"] = False if config_section.get("has_titles") == "false" else True
        default_config["titleLineNum"] = config_section.get("title") if config_section.get("title")!= None else 1
        default_config["dataLineNum"] = config_section.get("data") if config_section.get("data")!= None else 2
        default_config["firstLineToProcess"] = config_section.get("first_line_to_process") if config_section.get("first_line_to_process")!= None else 1
        default_config["lastLineToProcess"] = config_section.get("last_line_to_process")

        # Parsing data_prefix line with is in the form of alias: <uri>
        data_prefix_row = config_section["prefix_data"].split(" ")
        if(len(data_prefix_row)==2):
            # Set data prefix name and remove ":" from it.
            default_config["dataPrefix"] = data_prefix_row[0]
            # Set data prefix URI and remove "<" ">" from it.
            default_config["dataPrefixUri"] = data_prefix_row[1]
        else: 
            # If data prefix is not in desired format. Throw an error
            raise Exception("config.ini must contain prefix_data field in the form of {prefix}: {uri}")
        
        # Parsing predicate_prefix line with is in the form of alias: <uri>
        prefix_predicate_row = config_section["prefix_predicate"].split(" ")
        if(len(prefix_predicate_row)==2):
            # Set predicate prefix name and remove ":" from it.
            default_config["predicatePrefix"] = prefix_predicate_row[0].replace(":", "")
            # Set predicate prefix URI and remove "<" ">" from it.
            default_config["predicatePrefixUri"] = prefix_predicate_row[1].replace("<","").replace(">","")
        else: 
            # If predicate prefix is not in desired format. Throw an error
            raise Exception("config.ini must contain prefix_predicate field in the form of {prefix}: {uri}")
        
        return default_config

def main():
    print("Config!")
    print(Config.get_config())