# To represent a second_order markov chain
# Such that different status have chances (sum to 1) to transfer to the next status

from typing import Any, Dict, List
from Markov_Chain.status import Any, status
import random

# -------------------------------------------------------------------------------------------------
class secondOrderMarkovChain():
    """To represent a second-order Markov Chain"""

#READ FROM FILE
    # ----------------------------------- Fields ---------------------------------------
    _genre_name = ''
    """The genre that this 2-order Markov Chain is learning"""
    _purpose = True
    """True: this MC is for chords // False: this MC is for duration"""
    _all_status: List[status]
    """All the status in this Markov Chain"""
    _happen_time_table: Dict[status, Dict[status, Dict[status, int]]]
    """How many times did transition from one status to another happened"""
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

            # Refresh the Markov Chain
            self.refresh_mc()

        else:
            raise ValueError('Hey! You cannot pass three NULL values')

    # To enlarge the 3D happening-time table by adding one new status
    def enlarge_happen_time_table(self, new_stat: status) -> None:
        # We enlarge the table dimension-by-dimension
        for prev_prev_status in self._happen_time_table.keys():
            for prev_status in self._happen_time_table.get(prev_prev_status).keys():
                #inner_update = {new_stat, 0}
                #self._happen_time_table.get(prev_prev_status).get(prev_status).update(inner_update)
                self._happen_time_table.get(prev_prev_status).get(prev_status)[new_stat] = 0

            update_1d: Dict[status, int]
            update_1d = {}
            for one_existing_status in self._all_status:
                update_1d[one_existing_status] = 0
            #outer_update = {new_stat, update_1d}
            #self._happen_time_table.get(prev_prev_status).update(outer_update)
            self._happen_time_table.get(prev_prev_status)[new_stat] = update_1d

        update_2d: Dict[status, Dict[status, int]]
        update_2d = {}
        for one_existing_prev in self._all_status:
            this_existing_prev_table = {}
            for one_existing_next in self._all_status:
                this_existing_prev_table[one_existing_next] = 0
            update_2d[one_existing_prev] = this_existing_prev_table
        self._happen_time_table[new_stat] = update_2d



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
        last_stat_existing_name = self._all_status.__getitem__(len(self._all_status) - 1).get_status_name()

        with open('happen_time_table.txt', 'w') as wf:  #Location
            wf.write(self._genre_name + '\n')
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
                            wf.write(prev_prev_stat.get_status_name() + prev_stat.get_status_name()
                                     + next_stat.get_status_name() + ':' + str(this_happen_time))
                        else:
                            wf.write(prev_prev_stat.get_status_name() + prev_stat.get_status_name()
                                     + next_stat.get_status_name() + ':' + str(this_happen_time) + '\n')

    # TO WRITE THE CURRENT MARKOV CHAIN TO A FILE
    def write_markov_chain_to_file(self) -> None:
        last_stat_existing_name = self._all_status.__getitem__(len(self._all_status) - 1).get_status_name()
        mc_copy = self.get_markov_chain()

        with open('markov_chain_table.txt', 'w') as wf:
            wf.write(self._genre_name + '\n')
            for prev_prev_stat in mc_copy.keys():
                this_2d = mc_copy.get(prev_prev_stat)
                for prev_stat in this_2d.keys():
                    this_1d = this_2d.get(prev_stat)
                    for next_stat in this_1d.keys():
                        this_possibility = this_1d.get(next_stat)
                        if ((prev_prev_stat.get_status_name() == last_stat_existing_name)
                                and (prev_stat.get_status_name() == last_stat_existing_name)
                                and (next_stat.get_status_name() == last_stat_existing_name)):
                            wf.write(prev_prev_stat.get_status_name() + prev_stat.get_status_name()
                                     + next_stat.get_status_name() + ':' + str(this_possibility))
                        else:
                            wf.write(prev_prev_stat.get_status_name() + prev_stat.get_status_name()
                                     + next_stat.get_status_name() + ':' + str(this_possibility) + '\n')


    # TO READ A FILE AND TO GET THE HAPPEN-TIME TABLE
    def read_happen_time_table_from_file(self) -> None:
        table_to_construct = {}


    # TO READ A FILE AND TO GET THE MARKOV CHAIN
    def read_markov_chain_from_file(self) -> Dict:
        pass
