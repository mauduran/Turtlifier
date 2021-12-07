import os


class FileUtils:
    @staticmethod
    def file_cleanup(file_name: str):
        """
        Method to remove temporary file given its filename
        """
        os.remove(file_name)

    @staticmethod
    def write_file(output_file_name: str, file_content: str):
        """
        Method to create a file with desired output_file_name and write
        the file_content on it.
        """ 
        f = open(output_file_name, "w")
        f.write(file_content)
        f.close()
