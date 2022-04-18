# To represent a second_order markov chain
# Such that different status have chances (sum to 1) to transfer to the next status

from typing import Any, Dict, List
from midiparser_backend.src.status import Any, status
#from Markov_Chain.status import Any, status
import random


# -------------------------------------------------------------------------------------------------
class secondOrderMarkovChain():
    """To represent a second-order Markov Chain"""

    # ----------------------------------- Fields ---------------------------------------
    _genre_name = ''
    """The genre that this 2-order Markov Chain is learning"""
    _purpose = True
    """True: this MC is for chords // False: this MC is for duration"""
    _all_status: List[status]
    """All the status in this Markov Chain"""
    _happen_time_table: Dict[status, Dict[status, Dict[status, int]]]
    """How many times did transition from one status to another happened"""
    # Note: all_status and happen_time_table are temporal tool to calculate the Markov Chain
    # They are not required to always be equivalent to the Markov Chain
    _markov_chain_table: Dict[status, Dict[status, Dict[status, float]]]
    """The Markov Chain as the result"""

    # --------------------------------- Constructor ------------------------------------
    def __init__(self, genre_name: str, for_chords: bool) -> None:
        """Constructor for a Markov Chain"""

        self._genre_name = genre_name
        """The name of the genre is given"""
        self._purpose = for_chords
        """The purpose of this Markov Chain"""
        self._all_status = []
        """All the status in this Markov Chain"""
        self._happen_time_table = {}
        """The table is initialized as the very base case"""
        self._markov_chain_table = {}
        """The table is initialized as the very base case"""

    # ----------------------------------- Methods --------------------------------------
    # -----------------------------------------------------
    # ---------------------- BASIC ------------------------
    # -----------------------------------------------------
    # HASHCODE
    def __hash__(self) -> int:
        result = 0
        for one_status in self._all_status:
            result = result + hash(one_status)
        return result

    # EQUAL (==)
    def __eq__(self, obj: Any) -> bool:
        if not isinstance(obj, secondOrderMarkovChain):
            return False
        return set(self._all_status) == set(obj._all_status) and len(self._all_status) == len(obj._all_status)

    # -----------------------------------------------------
    # --------------------- GETTERS -----------------------
    # -----------------------------------------------------
    # TO GET THE NAME OF GENRE
    def get_genre_name(self) -> str:
        return self._genre_name

    # TO GET ALL STATUS
    def get_all_status(self) -> List[status]:
        return self._all_status

    # TO GET THE HAPPEN-TIME TABLE
    def get_happen_time_table(self) -> Dict[status, Dict[status, Dict[status, int]]]:
        return self._happen_time_table

    # TO GET THE SECOND-ORDER MARKOV CHAIN BASED ON THE HAPPEN_TIME TABLE
    def get_markov_chain(self) -> Dict[status, Dict[status, Dict[status, float]]]:
        return self._markov_chain_table

    # TO GET THE AMOUNT OF TIME THAT ONE KIND OF TRANSITION HAPPENING
    def spit_one_happening(self, s1: str, s2: str, s3: str) -> int:
        status_to_find1 = status(s1)
        status_to_find2 = status(s2)
        status_to_find3 = status(s3)
        result = self._happen_time_table.get(status_to_find1).get(status_to_find2).get(status_to_find3)
        print(result)
        return result

    # TO GET THE AMOUNT OF TIME OF ALL KINDS OF TRANSITIONS HAPPENING
    def spit_out_all_happening(self) -> None:
        for this_prev_prev_stat_table_happen_time in self._happen_time_table.values():
            for this_prev_stat_table_happen_time in this_prev_prev_stat_table_happen_time.values():
                for this_happen_time in this_prev_stat_table_happen_time.values():
                    print(this_happen_time, end=" ")
                print("\n")

    # TO GET THE POSSIBILITIES ALL KINDS OF TRANSITIONS HAPPENING
    def spit_out_all_possibility(self) -> None:
        for prev_prev_status_table in self._markov_chain_table.values():
            for prev_status_table in prev_prev_status_table.values():
                for this_next_status_possibility in prev_status_table.values():
                    print(this_next_status_possibility, end=" ")
                print("\n")

    # -----------------------------------------------------
    # -------------------- REFRESHERS ---------------------
    # -----------------------------------------------------
    # THIS IS WHAT HAPPEN WHEN READING 3 CHARACTERS IN THE CSV FILE
    def add_one_event(self, prev_prev_stat_name: str, prev_stat_name: str, next_stat_name: str) -> None:

        # At the very first two iterations:
        if prev_prev_stat_name is None and prev_stat_name is None and next_stat_name is not None:
            """This is the very first chord in the CSV file"""
            # Transitions will not be counted
            next_stat = status(next_stat_name)

            # Check if there are new status, but this will happen, trust me
            if not self._all_status.__contains__(next_stat):
                self._all_status.append(next_stat)
                self.enlarge_happen_time_table(next_stat)

        elif prev_prev_stat_name is None and prev_stat_name is not None and next_stat_name is not None:
            """This is the second chord in the CSV file"""
            # Transitions will be evened
            prev_stat = status(prev_stat_name)
            next_stat = status(next_stat_name)

            # Check if there are new status
            if not self._all_status.__contains__(prev_stat):
                self._all_status.append(prev_stat)
                self.enlarge_happen_time_table(prev_stat)
            if not self._all_status.__contains__(next_stat):
                self._all_status.append(next_stat)
                self.enlarge_happen_time_table(next_stat)

            # Upgrade every prev-prev-stat's 2D table
            for prev_prev_stat in self._happen_time_table.keys():
                original_happen_time = self._happen_time_table.get(prev_prev_stat).get(prev_stat).get(next_stat)
                prev_prev_stat_table_copy = self._happen_time_table.get(prev_prev_stat)
                prev_stat_table_copy = prev_prev_stat_table_copy.get(prev_stat)
                inner_update = {next_stat: original_happen_time + 1}
                prev_stat_table_copy.update(inner_update)
                outer_update = {prev_stat: prev_stat_table_copy}
                prev_prev_stat_table_copy.update(outer_update)
                outer_outer_update = {prev_prev_stat: prev_prev_stat_table_copy}
                self._happen_time_table.update(outer_outer_update)

        elif prev_prev_stat_name is not None and prev_stat_name is not None and next_stat_name is not None:
            """The third and all the later chords in the CSV file"""
            prev_prev_stat = status(prev_prev_stat_name)
            prev_stat = status(prev_stat_name)
            next_stat = status(next_stat_name)

            # Check if there are new status
            if not self._all_status.__contains__(prev_prev_stat):
                self._all_status.append(prev_prev_stat)
                self.enlarge_happen_time_table(prev_prev_stat)
            if not self._all_status.__contains__(prev_stat):
                self._all_status.append(prev_stat)
                self.enlarge_happen_time_table(prev_stat)
            if not self._all_status.__contains__(next_stat):
                self._all_status.append(next_stat)
                self.enlarge_happen_time_table(next_stat)

            # Upgrade the corresponding grid in the 3D table
            original_happen_time = self._happen_time_table.get(prev_prev_stat).get(prev_stat).get(next_stat)
            prev_prev_stat_table_copy = self._happen_time_table.get(prev_prev_stat)
            prev_stat_table_copy = prev_prev_stat_table_copy.get(prev_stat)
            inner_update = {next_stat: original_happen_time + 1}
            prev_stat_table_copy.update(inner_update)
            outer_update = {prev_stat: prev_stat_table_copy}
            prev_prev_stat_table_copy.update(outer_update)
            outer_outer_update = {prev_prev_stat: prev_prev_stat_table_copy}
            self._happen_time_table.update(outer_outer_update)

            # Refresh the Markov Chain - MOVED TO THE END, OTHERWISE IT IS SO SLOW
            # self.refresh_mc()

        else:
            raise ValueError('Hey! You cannot pass three NULL values')

    # To enlarge the 3D happening-time table by adding one new status
    def enlarge_happen_time_table(self, new_stat: status) -> None:
        # We enlarge the table dimension-by-dimension
        for prev_prev_status in self._happen_time_table.keys():
            for prev_status in self._happen_time_table.get(prev_prev_status).keys():
                self._happen_time_table.get(prev_prev_status).get(prev_status)[new_stat] = 0

            update_1d: Dict[status, int]
            update_1d = {}
            for one_existing_status in self._all_status:
                update_1d[one_existing_status] = 0
            self._happen_time_table.get(prev_prev_status)[new_stat] = update_1d

        update_2d: Dict[status, Dict[status, int]]
        update_2d = {}
        for one_existing_prev in self._all_status:
            this_existing_prev_table = {}
            for one_existing_next in self._all_status:
                this_existing_prev_table[one_existing_next] = 0
            update_2d[one_existing_prev] = this_existing_prev_table
        self._happen_time_table[new_stat] = update_2d

    # To enlarge the 3D Markov Chain Table by adding one status
    def enlarge_mc_table(self, new_stat: status) -> None:
        all_status_involved = []
        for one_existing_status in self._markov_chain_table.keys():
            all_status_involved.append(one_existing_status)
        all_status_involved.append(new_stat)

        # We enlarge the table dimension-by-dimension
        for prev_prev_status in self._markov_chain_table.keys():
            for prev_status in self._markov_chain_table.get(prev_prev_status).keys():
                self._markov_chain_table.get(prev_prev_status).get(prev_status)[new_stat] = 0.0

            update_1d: Dict[status, float]
            update_1d = {}
            for one_existing_status in all_status_involved:
                update_1d[one_existing_status] = 0.0
            self._markov_chain_table.get(prev_prev_status)[new_stat] = update_1d

        update_2d: Dict[status, Dict[status, float]]
        update_2d = {}
        for one_existing_prev in all_status_involved:
            this_existing_prev_table = {}
            for one_existing_next in all_status_involved:
                this_existing_prev_table[one_existing_next] = 0
            update_2d[one_existing_prev] = this_existing_prev_table
        self._markov_chain_table[new_stat] = update_2d

    # To refresh the markov chain by the current happening-time table
    def refresh_mc(self) -> None:
        new_Markov_Chain: Dict[status, Dict[status, Dict[status, float]]]
        new_Markov_Chain = {}

        for prev_prev_status in self._happen_time_table.keys():
            this_prev_prev_stat_table = {}

            # Get the 2D dictionary on this prev_prev_status
            this_prev_prev_happening_table = self._happen_time_table.get(prev_prev_status)

            for prev_status in this_prev_prev_happening_table.keys():
                this_prev_stat_table = {}

                # Count how many happenings are in total for this previous state
                this_prev_stat_all_happening = 0
                this_prev_stat_table_happen_time = this_prev_prev_happening_table.get(prev_status)
                for one_possibility in this_prev_stat_table_happen_time.values():
                    this_prev_stat_all_happening = this_prev_stat_all_happening + one_possibility

                # Calculate the possibility for each transition
                for next_status in this_prev_stat_table_happen_time.keys():
                    if this_prev_stat_all_happening == 0:
                        possibility = 1 / len(self._all_status)
                    else:
                        possibility = this_prev_stat_table_happen_time.get(next_status) / this_prev_stat_all_happening
                    this_prev_stat_table[next_status] = possibility

                this_prev_prev_stat_table[prev_status] = this_prev_stat_table

            new_Markov_Chain[prev_prev_status] = this_prev_prev_stat_table

        self._markov_chain_table = new_Markov_Chain

    # -----------------------------------------------------
    # -------------------- THE RUNNER ---------------------
    # -----------------------------------------------------
    # TO RUN THE SECOND-ORDER MARKOV CHAIN
    def run(self, starting_status: str, run_num: int) -> List[status]:
        self.refresh_mc() # ADDED TO MAKE SURE
        result = []
        static_markov = self.get_markov_chain()
        current_stat = status(starting_status)
        previous_stat = status(starting_status)

        result.append(current_stat)
        print(current_stat.get_status_name(), end=" ")

        attempt = 0
        while attempt < run_num:
            current_stat_possibility_chart: Dict[status, float]

            if attempt == 0:
                # We come up with the average possibility to transfer to other states
                current_stat_possibility_chart = {}

                for next_stat_to_spit in static_markov.keys():
                    average_possibility = 0.0
                    factor = 0.0

                    for prev_prev_stat in static_markov.keys():
                        this_prev_prev_possibility = static_markov.get(prev_prev_stat).get(current_stat)\
                            .get(next_stat_to_spit)
                        average_possibility = average_possibility + this_prev_prev_possibility
                        factor = factor + 1.0

                    average_possibility = average_possibility / factor
                    current_stat_possibility_chart[next_stat_to_spit] = average_possibility

            else:
                current_stat_possibility_chart = static_markov.get(previous_stat).get(current_stat)

            all_next_stat = list(current_stat_possibility_chart.keys())
            all_next_stat_possibility = list(current_stat_possibility_chart.values())

            # Get the next status using the current Markov Model
            rand = random.random()
            get_stat_attempt = 0
            while rand > 0:
                rand = rand - all_next_stat_possibility[get_stat_attempt]
                get_stat_attempt = get_stat_attempt + 1

            previous_stat = current_stat
            current_stat = all_next_stat[get_stat_attempt - 1]

            print(current_stat.get_status_name(), end=" ")
            result.append(current_stat)

            attempt = attempt + 1

        #print (current_stat.get_status_name())
        return result

    # -----------------------------------------------------
    # ---------------- READERS & WRITERS ------------------
    # -----------------------------------------------------
    # TO WRITE THE CURRENT HAPPEN TIME TABLE TO A FILE
    def write_happen_time_table_to_file(self) -> None:
        self.refresh_mc()  # ADDED TO MAKE SURE MC IS UP-TO-DATE
        last_stat_existing_name = self._all_status.__getitem__(len(self._all_status) - 1).get_status_name()

        with open(self._genre_name + '_happen_time_table.txt', 'w') as wf:  # Location
            wf.write(self._genre_name + '\n')

            if self._purpose:
                wf.write('Chord' + '\n')
            else:
                wf.write('Duration' + '\n')

            for prev_prev_stat in self._happen_time_table.keys():
                this_2d = self._happen_time_table.get(prev_prev_stat)
                for prev_stat in this_2d.keys():
                    this_1d = this_2d.get(prev_stat)
                    for next_stat in this_1d.keys():
                        this_happen_time = this_1d.get(next_stat)
                        # Add a new line if this is the last item of this document
                        if ((prev_prev_stat.get_status_name() == last_stat_existing_name)
                            and (prev_stat.get_status_name() == last_stat_existing_name)
                            and (next_stat.get_status_name() == last_stat_existing_name)):
                            wf.write(prev_prev_stat.get_status_name() + ',' + prev_stat.get_status_name()
                                     + ',' + next_stat.get_status_name() + ':' + str(this_happen_time))
                        else:
                            wf.write(prev_prev_stat.get_status_name() + ',' + prev_stat.get_status_name()
                                     + ',' + next_stat.get_status_name() + ':' + str(this_happen_time) + '\n')

    # TO WRITE THE CURRENT MARKOV CHAIN TO A FILE
    def write_markov_chain_to_file(self) -> None:
        self.refresh_mc()  # ADDED TO MAKE SURE
        last_stat_existing_name = self._all_status.__getitem__(len(self._all_status) - 1).get_status_name()
        mc_copy = self.get_markov_chain()

        with open(self._genre_name + '_markov_chain_table.txt', 'w') as wf:
            wf.write(self._genre_name + '\n')

            if self._purpose:
                wf.write('Chord' + '\n')
            else:
                wf.write('Duration' + '\n')

            for prev_prev_stat in mc_copy.keys():
                this_2d = mc_copy.get(prev_prev_stat)
                for prev_stat in this_2d.keys():
                    this_1d = this_2d.get(prev_stat)
                    for next_stat in this_1d.keys():
                        this_possibility = this_1d.get(next_stat)
                        if ((prev_prev_stat.get_status_name() == last_stat_existing_name)
                                and (prev_stat.get_status_name() == last_stat_existing_name)
                                and (next_stat.get_status_name() == last_stat_existing_name)):
                            wf.write(prev_prev_stat.get_status_name() + ',' + prev_stat.get_status_name()
                                     + ',' + next_stat.get_status_name() + ':' + str(this_possibility))
                        else:
                            wf.write(prev_prev_stat.get_status_name() + ',' + prev_stat.get_status_name()
                                     + ',' + next_stat.get_status_name() + ':' + str(this_possibility) + '\n')

    # TO READ A FILE AND TO GET THE HAPPEN-TIME TABLE
    def read_happen_time_table_from_file(self, genre_name: str) -> None:
        # Everything in the Markov Chain is refreshed
        self._all_status = []
        self._happen_time_table = {}
        self._markov_chain_table = {}

        # Read from file
        with open(genre_name + '_happen_time_table.txt', 'r') as rf:
            lines = rf.readlines()
            current_line_num = 0

            # Read each line
            for oneline in lines:
                current_line_num = current_line_num + 1

                if current_line_num == 1:
                    # Information of the genre
                    self._genre_name = str(oneline)

                elif current_line_num == 2:
                    # Information of the purpose (for chords or for duration)
                    if str(oneline) == 'Chord' or str(oneline) == 'Chord\n':
                        self._purpose = True
                    elif str(oneline) == 'Duration' or str(oneline) == 'Duration\n':
                        self._purpose = False
                    else:
                        raise ValueError('Dude, you could only pass in Chord or Duration')

                else:
                    # Information of the major content
                    # Here, the system collect all the new status raised in the file
                    one_event_info = str(oneline)

                    first_comma_position = 0
                    second_comma_position = 0
                    column_position = 0
                    end_position = 0

                    first_comma_found = False
                    second_comma_found = False

                    current_char_position = 0
                    for one_letter in one_event_info:
                        if one_letter == ',':
                            if (not first_comma_found) and (not second_comma_found):
                                first_comma_position = current_char_position
                                first_comma_found = True
                            else:
                                second_comma_position = current_char_position
                                second_comma_found = True
                        if one_letter == ':' and first_comma_found and second_comma_found:
                            column_position = current_char_position

                        current_char_position = current_char_position + 1
                    end_position = current_char_position

                    prev_prev_stat_name = one_event_info[0:first_comma_position]
                    prev_stat_name = one_event_info[(first_comma_position + 1):second_comma_position]
                    next_stat_name = one_event_info[(second_comma_position + 1):column_position]
                    this_transition_happen_time = int(one_event_info[(column_position + 1):end_position])

                    add_event_count = 0
                    while add_event_count < this_transition_happen_time:
                        self.add_one_event(prev_prev_stat_name, prev_stat_name, next_stat_name)
                        add_event_count = add_event_count + 1

        self.refresh_mc()

    # TO READ A FILE AND TO GET THE MARKOV CHAIN
    def read_markov_chain_from_file(self, genre_name: str) -> None:
        # This time, the happen_time_table is not going to be refreshed
        # We first erase the original Markov Chain
        self._markov_chain_table = {}
        all_status_involved = []

        with open(genre_name + '_markov_chain_table.txt', 'r') as rf:
            lines = rf.readlines()
            current_line_num = 0

            # Read each line
            for oneline in lines:
                current_line_num = current_line_num + 1

                if current_line_num == 1:
                    # Information of the genre
                    self._genre_name = str(oneline)

                elif current_line_num == 2:
                    # Information of the purpose (for chords or for duration)
                    if str(oneline) == 'Chord' or str(oneline) == 'Chord\n':
                        self._purpose = True
                    elif str(oneline) == 'Duration' or str(oneline) == 'Duration\n':
                        self._purpose = False
                    else:
                        raise ValueError('Dude, you could only pass in Chord or Duration')

                else:
                    # Information of the major content
                    # Here, the system collect all the new status raised in the file
                    one_event_info = str(oneline)

                    first_comma_position = 0
                    second_comma_position = 0
                    column_position = 0
                    end_position = 0

                    first_comma_found = False
                    second_comma_found = False

                    current_char_position = 0
                    for one_letter in one_event_info:
                        if one_letter == ',':
                            if (not first_comma_found) and (not second_comma_found):
                                first_comma_position = current_char_position
                                first_comma_found = True
                            else:
                                second_comma_position = current_char_position
                                second_comma_found = True
                        if one_letter == ':' and first_comma_found and second_comma_found:
                            column_position = current_char_position

                        current_char_position = current_char_position + 1
                    end_position = current_char_position

                    prev_prev_stat_name = one_event_info[0:first_comma_position]
                    prev_stat_name = one_event_info[(first_comma_position + 1):second_comma_position]
                    next_stat_name = one_event_info[(second_comma_position + 1):column_position]
                    this_transition_possibility = float(one_event_info[(column_position + 1):end_position])

                    prev_prev_stat = status(prev_prev_stat_name)
                    prev_stat = status(prev_stat_name)
                    next_stat = status(next_stat_name)

                    # Add this to the markov table
                    if not all_status_involved.__contains__(prev_prev_stat):
                        self.enlarge_mc_table(prev_prev_stat)
                        all_status_involved.append(prev_prev_stat)
                    if not all_status_involved.__contains__(prev_stat):
                        self.enlarge_mc_table(prev_stat)
                        all_status_involved.append(prev_stat)
                    if not all_status_involved.__contains__(next_stat):
                        self.enlarge_mc_table(next_stat)
                        all_status_involved.append(next_stat)

                    self._markov_chain_table.get(prev_prev_stat).get(prev_stat)[next_stat] = this_transition_possibility

    # -----------------------------------------------------
    # -------------------- DISPLAYER ----------------------
    # -----------------------------------------------------
    def displayer(self) -> None:
        pass
    # If we have remaining time at last, we could do the displayer