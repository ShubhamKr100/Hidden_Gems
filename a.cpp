#include <bits/stdc++.h>

using namespace std;

// --- Helper Functions ---
string ltrim(const string &str) {
    string s(str);
    s.erase(s.begin(), find_if(s.begin(), s.end(), [](unsigned char ch) {
        return !isspace(ch);
    }));
    return s;
}

string rtrim(const string &str) {
    string s(str);
    s.erase(find_if(s.rbegin(), s.rend(), [](unsigned char ch) {
        return !isspace(ch);
    }).base(), s.end());
    return s;
}

struct Interval {
    long long start;
    long long end;
    string brand;
};

Interval parseInterval(const string& s) {
    size_t firstComma = s.find(',');
    size_t secondComma = s.find(',', firstComma + 1);

    long long start = stoll(s.substr(0, firstComma));
    long long end = stoll(s.substr(firstComma + 1, secondComma - firstComma - 1));
    string brand = s.substr(secondComma + 1);

    return {start, end, brand};
}

string formatOutput(int bin, long long val) {
    string s = to_string(val);
    while (s.length() < 10) {
        s = "0" + s;
    }
    return to_string(bin) + s;
}

/*
 * Complete the 'obfuscateCardMetadata' function below.
 */
vector<string> obfuscateCardMetadata(int card_bin, vector<string> card_intervals) {
    vector<Interval> intervals;
    
    for (const string& s : card_intervals) {
        intervals.push_back(parseInterval(s));
    }

    // Sort: Start ASC, End DESC (Crucial to identify the largest covering interval first)
    sort(intervals.begin(), intervals.end(), [](const Interval& a, const Interval& b) {
        if (a.start != b.start)
            return a.start < b.start;
        return a.end > b.end;
    });

    // UPDATED: Create two separate vectors. We process 'main' but keep 'subsets'.
    vector<Interval> mainIntervals;
    vector<Interval> subsetIntervals; 

    for (const auto& curr : intervals) {
        if (mainIntervals.empty()) {
            mainIntervals.push_back(curr);
        } else {
            Interval& prev = mainIntervals.back();
            
            // UPDATED: Check if curr is a subset of prev
            if (curr.end <= prev.end) {
                // UPDATED: Do not discard. Save it to add back later.
                subsetIntervals.push_back(curr); 
            } else {
                mainIntervals.push_back(curr);
            }
        }
    }

    if (mainIntervals.empty() && !subsetIntervals.empty()) mainIntervals = subsetIntervals; // Safety fallback
    if (mainIntervals.empty()) return {};

    // UPDATED: Perform extension and gap filling ONLY on the main covering intervals
    mainIntervals[0].start = 0;
    mainIntervals.back().end = 9999999999LL;

    for (size_t i = 0; i < mainIntervals.size() - 1; ++i) {
        mainIntervals[i].end = mainIntervals[i+1].start - 1;
    }

    // UPDATED: Merge adjacent intervals ONLY on the main covering chain
    vector<Interval> mergedMain;
    for (const auto& curr : mainIntervals) {
        if (mergedMain.empty()) {
            mergedMain.push_back(curr);
        } else {
            Interval& prev = mergedMain.back();
            if (prev.brand == curr.brand) {
                prev.end = curr.end; 
            } else {
                mergedMain.push_back(curr);
            }
        }
    }

    // UPDATED: Combine the processed main intervals with the original subset intervals
    vector<Interval> finalIntervals = mergedMain;
    finalIntervals.insert(finalIntervals.end(), subsetIntervals.begin(), subsetIntervals.end());

    // UPDATED: Sort the final combined list by start time for output
    sort(finalIntervals.begin(), finalIntervals.end(), [](const Interval& a, const Interval& b) {
        if (a.start != b.start) return a.start < b.start;
        return a.end < b.end;
    });

    vector<string> result;
    for (const auto& interval : finalIntervals) {
        string startStr = formatOutput(card_bin, interval.start);
        string endStr = formatOutput(card_bin, interval.end);
        result.push_back(startStr + "," + endStr + "," + interval.brand);
    }

    return result;
}

int main() {
    ostream* fout = &cout;
    
    // ofstream file_out(getenv("OUTPUT_PATH"));
    // fout = &file_out;

    string card_bin_temp;
    getline(cin, card_bin_temp);
    if(card_bin_temp.empty()) return 0;
    int card_bin = stoi(ltrim(rtrim(card_bin_temp)));

    string card_intervals_count_temp;
    getline(cin, card_intervals_count_temp);
    int card_intervals_count = stoi(ltrim(rtrim(card_intervals_count_temp)));

    vector<string> card_intervals(card_intervals_count);

    for (int i = 0; i < card_intervals_count; i++) {
        string card_intervals_item;
        getline(cin, card_intervals_item);
        card_intervals[i] = card_intervals_item;
    }

    vector<string> result = obfuscateCardMetadata(card_bin, card_intervals);

    for (size_t i = 0; i < result.size(); i++) {
        *fout << result[i];
        if (i != result.size() - 1) {
            *fout << "\n";
        }
    }

    *fout << "\n";

    return 0;
}




0