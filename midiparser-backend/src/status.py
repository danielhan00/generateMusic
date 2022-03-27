# To represent a specific status of music
# Including but not limiting to:
#  - Chord (Roman Numeral)
#  - Number of chords in a measure
#  - Note
#  - Number of notes in a beat
#  - Dynamics


from tokenize import String
from typing import Any, Tuple, Dict, Callable, Iterable


class status():
    """A status in a Markov Chain"""

    # ---------------------------- Fields --------------------------------
    _status_name: str
    "The name of the status"

    # -------------------------- Constructor -----------------------------
    def __init__(self, status_name: str) -> None:
        if not isinstance(status_name, str):
            raise ValueError('Name of the status must be a string.')

        self._status_name = status_name

    # ---------------------------- Methods -------------------------------
    def __hash__(self) -> int:
        return hash(self._status_name)

    def __eq__(self, obj: Any) -> bool:
        if not isinstance(obj, status):
            return False
        return self._status_name == obj._status_name

    def get_status_name(self) -> String:
        return self._status_name

    def spit_name(self) -> None:
        print(self._status_name)
