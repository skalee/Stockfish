# This Makefile is in public domain.  Other files are licensed differently.

MEMORY = 67108864  # 64 MB
TARGET = ../stockfish.js
RUNNER = ../stockfish

EXPORTED_FUNCTIONS = _main _parse_uci_command uci emit

CXX = EMCC_FAST_COMPILER=0 em++
NODE = node

OPTIMIZATION = -O1

CXXFLAGS = \
	$(OPTIMIZATION) \
	-Wall

LDFLAGS = \
	$(OPTIMIZATION) \
	-s TOTAL_MEMORY=$(MEMORY) \
	-s NO_EXIT_RUNTIME=1 \
	-s EXPORTED_FUNCTIONS="[$(EXPORTED_FUNCTIONS:%='%',)]"

OBJS = benchmark.bc bitbase.bc bitboard.bc book.bc endgame.bc evaluate.bc \
	main.bc material.bc misc.bc movegen.bc movepick.bc notation.bc pawns.bc \
	position.bc search.bc thread.bc timeman.bc tt.bc uci.bc ucioption.bc

LIBS_JS =
PRE_JS  = pre.js
POST_JS =

.PHONY: run clean rebuild

$(TARGET): $(OBJS) $(LIBS_JS) $(PRE_JS) $(POST_JS)
	$(CXX) $(LDFLAGS) -o $@ $(OBJS) $(LIBS_JS:%=--js-library %) $(PRE_JS:%=--pre-js %) $(POST_JS:%=--post-js %)

%.bc: %.cpp *.h
	$(CXX) $(CXXFLAGS) -o $@ $<

clean:
	- rm $(TARGET) *.bc

rebuild: clean $(TARGET)

run: $(TARGET) $(RUNNER)
	./$(RUNNER)
