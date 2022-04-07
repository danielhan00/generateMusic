# To represent a second_order markov chain
# Such that different status have chances (sum to 1) to transfer to the next status

from typing import Any, Dict, List
from status import Any, status
import random


class secondOrderMarkovChain():
    """To represent a second-order Markov Chain"""

    # ---------------------------- Fields --------------------------------
    _all_status: List[status]
    """All the status in this Markov Chain"""
    _happen_time_table: Dict[status, Dict[status, Dict[status, int]]]
    """How many times did transition from one status to another happened"""

    # -------------------------- Constructor -----------------------------
    def __init__(self, given_all_status: List[str]) -> None:
        """Constructor for a Markov Chain"""

        self._all_status = []
        """All the status in this Markov Chain"""
        self._happen_time_table = {}
        """How many time does each kind of transition happened"""

        # Check for duplication
        if len(given_all_status) != len(set(given_all_status)):
            raise ValueError('No two status can have the same name')

        # Fill the all_status field of this class
        for oneItem in given_all_status:
            if not isinstance(oneItem, str):
                raise ValueError('Every item in the given list must be a string')
            new_status = status(oneItem)
            self._all_status.append(new_status)

        # Fill the happen_time_table of this class, with happening times being 0 at first
        for prev_prev_status in self._all_status:
            this_prev_prev_stat_table = {}

            for prev_status in self._all_status:
                this_prev_status_table = {}

                for next_status in self._all_status:
                    this_prev_status_table[next_status] = 0

                this_prev_prev_stat_table[prev_status] = this_prev_status_table

            self._happen_time_table[prev_prev_status] = this_prev_prev_stat_table

    # ---------------------------- Methods -------------------------------
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

    # TO GET ALL STATUS
    def get_all_status(self) -> List[status]:
        return self._all_status

    # TO GET THE HAPPEN-TIME TABLE
    def get_happen_time_table(self) -> Dict[status, Dict[status, Dict[status, int]]]:
        return self._happen_time_table

    # TO GET THE SECOND-ORDER MARKOV CHAIN BASED ON THE HAPPEN_TIME TABLE   改
    def get_markov_chain(self) -> Dict[status, Dict[status, Dict[status, float]]]:
        result = {}

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

            result[prev_prev_status] = this_prev_prev_stat_table

        return result

    # TO ADD ONE SPECIFIC EVENT
    def add_one_event(self, prev_prev_status: str, prev_status: str, next_status: str) -> None:
        prev_prev_stat = status(prev_prev_status)
        prev_stat = status(prev_status)
        next_stat = status(next_status)

        original_happen_time = self.get_happen_time_table().get(prev_prev_stat).get(prev_stat).get(next_stat)
        prev_prev_stat_table_copy = self._happen_time_table.get(prev_prev_stat)
        prev_stat_table_copy = prev_prev_stat_table_copy.get(prev_stat)
        inner_update = {next_stat: original_happen_time + 1}
        prev_stat_table_copy.update(inner_update)
        outer_update = {prev_stat: prev_stat_table_copy}
        prev_prev_stat_table_copy.update(outer_update)
        outer_outer_update = {prev_prev_stat: prev_prev_stat_table_copy}
        self._happen_time_table.update(outer_outer_update)

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

    # TO GET THE AMOUNT OF TIME THAT ONE KIND OF TRANSITION HAPPENING
    def spit_one_happening(self, s1: str, s2: str, s3: str) -> None:
        status_to_find1 = status(s1)
        status_to_find2 = status(s2)
        status_to_find3 = status(s3)
        result = self._happen_time_table.get(status_to_find1).get(status_to_find2).get(status_to_find3)
        print(result)

    # TO GET THE AMOUNT OF TIME OF ALL KINDS OF TRANSITIONS HAPPENING
    def spit_out_all_happening(self) -> None:
        for this_prev_prev_stat_table_happen_time in self._happen_time_table.values():
            for this_prev_stat_table_happen_time in this_prev_prev_stat_table_happen_time.values():
                for this_happen_time in this_prev_stat_table_happen_time.values():
                    print(this_happen_time, end=" ")
                print("\n")

    # TO GET THE POSSIBILITIES OF ALL KINDS OF TRANSITIONS HAPPENING   改
    def spit_out_all_possibility(self) -> None:
        for prev_prev_status_table in self.get_markov_chain().values():
            for prev_status_table in prev_prev_status_table.values():
                for this_next_status_possibility in prev_status_table.values():
                    print(this_next_status_possibility, end=" ")
                print("\n")
